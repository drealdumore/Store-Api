import express from "express";
import * as productController from "../controllers/productController.js";

const router = express.Router();

const { getAllProducts } = productController;

router.route("/").get(getAllProducts);

export default router;
