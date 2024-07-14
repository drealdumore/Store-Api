import User from "../models/userModel.js";
import * as factory from "./factoryController.js";

import catchAsync from "../utilities/catchAsync.js";
import AppError from "../utilities/appError.js";
import upload from "../utilities/multer.js";

// TO Make ADMIN
export const makeAdmin = catchAsync(async (req, res, next) => {
  // check if user exists
  const user = await User.findOne({ _id: req.params.id });

  if (!user) return next(new AppError("User does not exist", 404));

  // check if user role === admin
  if (user.role === "admin")
    return next(new AppError("User is already an admin", 400));

  // else make admin
  user.role = "admin";

  await user.save();

  res.status(200).json({
    status: "success",
    data: {
      data: user,
    },
  });
});

// TO Change User ROLES
export const changeUserRole = catchAsync(async (req, res, next) => {
  // check if user exists
  const user = await User.findOne({ _id: req.params.id });

  if (!user) return next(new AppError("User does not exist", 404));

  // ROLE to change TO
  const { role } = req.body;

  // CHECK if role is valid
  const validRoles = ["admin", "manager", "storekeeper"];

  if (!validRoles.includes(role)) {
    return next(new AppError("Invalid role", 400));
  }

  // CHECK if user already has the desired role
  if (user.role === role) {
    return next(new AppError(`User is already a ${role}`, 400));
  }

  // CHANGE ROLE
  user.role = role;

  await user.save();

  res.status(200).json({
    status: "success",
    data: {
      data: user,
    },
  });
});

// GET ALL ADMINS
export const getAllAdmin = catchAsync(async (req, res, next) => {
  const admins = await User.find({ role: "admin" });
  if (!admins) {
    return next(new AppError("No user with admin role", 400));
  }
  res.status(200).json({
    status: "success",
    results: admins.length,
    data: {
      data: admins,
    },
  });
});

// GET ADMIN
export const getAdmin = catchAsync(async (req, res, next) => {
  // 1. search if id exist && if role === admin
  const admin = await User.findOne({ _id: req.params.id, role: "admin" });

  // 2. if !admin
  if (!admin) return next(new AppError("Admin does not exist", 404));

  // ELSE
  res.status(200).json({
    status: "success",
    data: {
      data: admin,
    },
  });
});

// UPDATE ADMIN DATA
export const updateAdmin = catchAsync(async (req, res, next) => {
  const { name, email } = req.body;

  const admin = await User.findOneAndUpdate(
    {
      _id: req.params.id,
      role: "admin",
    },
    { name, email },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!admin) {
    return next(new AppError("Admin does not exist", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: admin,
    },
  });
});

// DELETE ADMIN
export const deleteAdmin = catchAsync(async (req, res, next) => {
  const admin = await User.findOneAndDelete({
    _id: req.params.id,
    role: "admin",
  });

  if (!admin) {
    return next(new AppError("Admin does not exist", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});