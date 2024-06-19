import User from "../models/userModel.js";
import AppError from "../utilities/appError.js";
import catchAsync from "../utilities/catchAsync.js";
import * as factory from "./factoryController.js";

export const insertUsers = factory.insertMany(User);

export const getAllUsers = factory.getAll(User);
export const getUser = factory.getOne(User);
export const updateUser = factory.updateOne(User);
export const deleteUser = factory.deleteOne(User);
