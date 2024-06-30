import express from "express";
import * as userController from "../controllers/userController.js";
import * as authController from "../controllers/authController.js";

const router = express.Router();

router.post("/insertMany", userController.insertUsers);

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route("/logout").get(authController.logout);
router.route("/forgotPassword").post(authController.forgotPassword);
router.route("/resetPassword/:token").patch(authController.forgotPassword);

// Protect all routes after this middleware && restrict to admin
router.use(authController.protect);
router.use(authController.restrictTo("admin"));

router.route("/").get(userController.getAllUsers);
router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
