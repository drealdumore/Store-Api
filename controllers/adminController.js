import User from "../models/userModel.js";
import AppError from "../utilities/appError.js";
import catchAsync from "../utilities/catchAsync.js";

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

export const updateAdmin = catchAsync(async (req, res, next) => {
  const admin = await User.findOneAndUpdate(
    {
      _id: req.params.id,
      role: "admin",
    },
    req.body,
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

export const createAdmin = catchAsync(async (req, res, next) => {
  const admin = await User.create({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  });
});


// how best to create admin
// 1. change user role to admin
// 2. create admin or manager by admin
