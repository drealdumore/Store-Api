import express from "express";
import * as adminController from "../controllers/adminController.js";
import * as authController from "../controllers/authController.js";

const router = express.Router();

// Protect all routes after this middleware && restrict to admin
router.use(authController.protect);
router.use(authController.restrictTo("admin"));

router.route("/").get(adminController.getAllAdmin);
router.route("/:id").get(adminController.getAdmin);
router.route("/:id").patch(adminController.updateAdmin);
router.route("/:id").delete(adminController.deleteAdmin);

export default router;
