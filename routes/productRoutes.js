import express from "express";
import * as productController from "../controllers/productController.js";

const router = express.Router();

// const { getAllProducts, createProduct } = productController;

router
  .route("/")
  .get(productController.getAllProducts)
  .post(productController.createProduct);

router
  .route("/:id")
  .get(productController.getProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

export default router;
