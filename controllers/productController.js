import Product from "../models/productModel.js";
import * as factory from "./factoryController.js";
import catchAsync from "../utilities/catchAsync.js";
import cloudinary from "../utilities/cloudinary.js";
import upload from "../utilities/multer.js";

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

export const insertProducts = factory.insertMany(Product);

export const getAllProducts = factory.getAllWithQuery(Product);

// export const createProduct = factory.createOne(Product);
export const createProduct = catchAsync(async (req, res, next) => {
  const {
    name,
    category,
    description,
    color,
    price,
    priceDiscount,
    inStock,
    quantity,
    brand,
  } = req.body;

  if (
    !name ||
    !category ||
    !description ||
    !price ||
    !color ||
    !priceDiscount ||
    !inStock ||
    !quantity ||
    !brand
  ) {
    return res.status(401).json({
      status: "fail",
      message: "All fields are required",
    });
  }

  const coverImagePath = req.files.coverImage[0].path;
  const imagesPaths = req.files.images.map((file) => file.path);

  const uploadImage = async (path, folder) => {
    console.log("uploadng...");

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        path,
        {
          folder: folder,
        },
        (error, result) => {
          if (error) reject(error);
          resolve(result.url);
        }
      );
    });
  };

  try {
    const folderName = `products/${name}`;

    console.log("start upload");

    const coverImage = await uploadImage(coverImagePath, folderName);

    const images = await Promise.all(
      imagesPaths.map((path) => uploadImage(path, folderName))
    );

    const newProduct = await Product.create({
      name,
      category,
      description,
      color,
      coverImage,
      images,
      price,
      priceDiscount,
      inStock,
      quantity,
      brand,
    });

    res.status(201).json({
      status: "success",
      message: "Product created successfully!!",
      data: {
        data: newProduct,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Error uploading images",
      error,
    });
  }
});

export const getProduct = factory.getOne(Product);

export const getProductWithPopulate = factory.getOneWithPopulate(Product, {
  path: "category",
});


// export const getProductWithPopulate = factory.getOneWithPopulate(Product, {
//   path: "reviews",
// });
export const updateProduct = factory.updateOne(Product);
export const deleteProduct = factory.deleteOne(Product);
