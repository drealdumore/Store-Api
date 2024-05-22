// import Product from "../models/productModel.js";

export const getAllProducts = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Gets all the products",
  });
};
