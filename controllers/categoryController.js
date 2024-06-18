import * as factory from "./factoryController.js";
import Category from "../models/categoryModel.js";
import catchAsync from "../utilities/catchAsync.js";
import AppError from "../utilities/appError.js";

export const getCategory = factory.getOneWithPopulate(Category);
export const getAllCategories = factory.getAll(Category);
export const updateCategory = factory.updateOne(Category);
export const deleteCategory = factory.deleteOne(Category);

// export const createCategory = factory.createOne(Category);
export const createCategory = catchAsync(async (req, res, next) => {
  const {name, description}= req.body
  const category = await Category.create({
    name,
    description
  });

  res.status(201).json({
    status: "success",
    data: {
      data: category,
    },
  });
});
