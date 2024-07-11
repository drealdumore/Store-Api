import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import sharp from "sharp";

import User from "../models/userModel.js";
import * as factory from "./factoryController.js";

import catchAsync from "../utilities/catchAsync.js";
import AppError from "../utilities/appError.js";

// To INSERT Array of users
export const insertUsers = factory.insertMany(User);

// GET all USERS
export const getAllUsers = factory.getAll(User);

// GET USER
export const getUser = factory.getOne(User);

// UPDATE USER
export const updateUser = factory.updateOne(User);

// DELETE USER
export const deleteUser = factory.deleteOne(User);

// RESIZE USER IMAGE
export const resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError("No file uploaded!", 400));

  console.log("Resizing...");

  const input = req.file.path;
  const outputDir = "uploads/resized";
  const outputPath = path.join(outputDir, `resized-${req.file.filename}`);

  // Ensure the output directory exists
  fs.mkdirSync(outputDir, { recursive: true });

  try {
    // Resize the image
    await sharp(input)
      .resize(500, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(outputPath);

    console.log("Resizing done...");

    console.log("Uploading start...");

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(outputPath, {
      folder: "users",
    });

    // Clean up temporary files
    try {
      fs.unlinkSync(outputPath);
      fs.rmdirSync("uploads", { recursive: true });
    } catch (cleanupError) {
      console.error("Error cleaning up files:", cleanupError);
    }

    res.status(200).json({
      status: "success",
      message: "Photo uploaded successfully",
      url: result.url,
    });
  } catch (error) {
    console.error("Error processing image:", error);
    return next(new AppError("Error processing image", 500));
  }
});

// GET CURRENT USER
export const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

const filter = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

// UPDATE CURRENT USER
export const updateMe = catchAsync(async (req, res, next) => {
  // Create error if user updates password
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  // FILTER out unwanted fields and SELECT wanted fields to be updated
  const filteredBody = filter(req.body, "name", "email");
  if (req.file) filteredBody.photo = req.file.filename;

  // UPDATE USER
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

// DELETE CURRENT USER
export const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});
