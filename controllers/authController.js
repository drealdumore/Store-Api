import crypto from "crypto";
import { promisify } from "util";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import catchAsync from "../utilities/catchAsync.js";
import AppError from "../utilities/appError.js";

// CREATE token using user ID
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// SEND the token as cookie to the user
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  // remove suer password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

export const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(newUser, 201, res);
});

export const createAdmin = catchAsync(async (req, res, next) => {
  const newAdmin = await User.create({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendToken(newAdmin, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  // find the user with email in the db, then select user password
  const user = await User.findOne({ email }).select("+password");

  // if user does not exist or incorrect password
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // ON SUCCESS
  createSendToken(user, 200, res);
});

export const logout = catchAsync(async (req, res) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
    message: "Logged out successfully!",
  });
});

// RESTRICT to Users
export const protect = catchAsync(async (req, res, next) => {
  // get token and check validity
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookie.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError("You are not logged in!. Please log in to gain acccess", 401)
    );
  }
  // verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);

  // check if user still exists
  if (!currentUser) return next(new AppError("User no longer exists", 401));

  // check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again", 401)
    );
  }

  // ELSE
  // ALLOW ACCESS TO PROTECTED ROUTE
  // add user to req and res object
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

// RESTRICT TO INPUTED ROLES
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // check if user role is in roles array
    // if not, throw error
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
  };
  next();
};

// FORGOT PASSWORD
export const forgotPassword = catchAsync(async (req, res, next) => {
  // find user with req email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("There is no user with that email address", 404));
  }

  // generate RESET TOKEN
  const resetToken = await user.createPasswordResetToken();
  console.log("resetToken: ", resetToken);

  // Temporarily disable validations to save password reset data
  await user.save({ validateBeforeSave: false });

  // SEND TO USER EMAIL

  res.status(200).json({
    status: "success",
    resetToken,
    message: "Token sent to email!",
  });

  // next();
});

export const resetPassword = catchAsync(async (req, res, next) => {
  // hash the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // check if hashedToken MATCHES any in the DB
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) return next(new AppError("Token is invalid or has expired", 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  // update changedPasswordAt -1sec

  // log the user in, send JWT
  createSendToken(user, 200, res);
});

export const updatePassword = catchAsync(async (req, res, next) => {
  // find user
  const user = await User.findById(req.user.id).select("+password");

  // compare current password with user password in DB
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong", 401));
  }

  // IF CORRECT,
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();

  createSendToken(user, 200, res);
});
