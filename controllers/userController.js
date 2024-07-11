import { v2 as cloudinary } from "cloudinary";
import sharp from "sharp";

import User from "../models/userModel.js";
import * as factory from "./factoryController.js";

import upload from "../utilities/multer.js";
import uploadImage from "../utilities/uploadImage.js";
import catchAsync from "../utilities/catchAsync.js";

export const insertUsers = factory.insertMany(User);

export const getAllUsers = factory.getAll(User);
export const getUser = factory.getOne(User);
export const updateUser = factory.updateOne(User);
export const deleteUser = factory.deleteOne(User);

export const resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}.jpeg`;

  const buffer = await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toBuffer();

  // Save the buffer to a temporary file
  const tempFilePath = `/tmp/${req.file.filename}`;
  await sharp(buffer).toFile(tempFilePath);

  // Use the uploadImage function
  try {
    const cloudinaryUrl = await uploadImage(tempFilePath, "users", req.user.id);
    req.file.cloudinaryUrl = cloudinaryUrl;
    next();
  } catch (error) {
    return next(error);
  }
});

export const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

export const deleteMe = catchAsync(async (req, res, next) => {
  console.log(req.user);
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});
