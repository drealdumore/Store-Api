import express from "express";
import * as adminController from "../controllers/adminController.js";
import * as authController from "../controllers/authController.js";

const router = express.Router();

// PROTECT all routes after this middleware && restrict to admin
router.use(authController.protect);
router.use(authController.restrictTo("admin"));

// TO Make ADMIN
router.route("/makeAdmin").post(adminController.makeAdmin);

// TO Change User ROLES
router.route("/changeRole").post(adminController.changeUserRole);

// GET ALL ADMINS
router.route("/").get(adminController.getAllAdmin);

// GET ADMIN
router.route("/:id").get(adminController.getAdmin);

// UPDATE ADMIN DATA
router.route("/:id").patch(adminController.updateAdmin);

// DELETE ADMIN
router.route("/:id").delete(adminController.deleteAdmin);

export default router;