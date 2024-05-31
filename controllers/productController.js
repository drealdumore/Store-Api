import Product from "../models/productModel.js";
import * as factory from "./factoryController.js";
import catchAsync from "../utilities/catchAsync.js";

// export const getAllProducts = catchAsync(async (req, res) => {
//   const products = await Product.find();

//   res.status(200).json({
//     status: "success",
//     results: products.length,
//     data: {
//       products,
//     },
//   });
// });

// export const createProduct = catchAsync(async (req, res) => {
//   try {
//     const newProduct = await Product.create(req.body);

//     res.status(201).json({
//       status: "success",
//       newProduct,
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: "fail",
//       message: err,
//     });
//   }
// });

// export const getProduct = catchAsync(async (req, res) => {
//   const id = req.params.id;

//   try {
//     const product = await Product.findById(id);

//     res.status(200).json({
//       status: "success",
//       data: {
//         product,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: "fail",
//       message: err,
//     });
//   }
// });

// export const updateProduct = catchAsync(async (req, res) => {
//   const id = req.params.id;

//   try {
//     const product = await Product.findByIdAndUpdate(id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     res.status(200).json({
//       status: "success",
//       data: {
//         product,
//       },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: "fail",
//       message: err,
//     });
//   }
// });

// export const deleteProduct = catchAsync(async (req, res) => {
//   const id = req.params.id;

//   try {
//     await Product.findByIdAndDelete(id);

//     res.status(204).json({
//       status: "success",
//       data: null,
//     });
//   } catch (err) {
//     res.status(400).json({
//       status: "fail",
//       message: err,
//     });
//   }
// });

export const getAllProducts = factory.getAllWithQuery(Product);

// export const getAllProducts = factory.getAll(Product);
// export const getAllProductsWithQuery = factory.getAllWithQuery(Product);

export const createProduct = factory.createOne(Product);
export const getProduct = factory.getOne(Product);
export const getProductWithPopulate = factory.getOneWithPopulate(Product, {
  path: "category",
});
// export const getProductWithPopulate = factory.getOneWithPopulate(Product, {
//   path: "reviews",
// });
export const updateProduct = factory.updateOne(Product);
export const deleteProduct = factory.deleteOne(Product);
