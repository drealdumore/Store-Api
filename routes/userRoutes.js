import express from "express";
import * as userController from "../controllers/userController.js";
import * as authController from "../controllers/authController.js";
import upload from "../utilities/multer.js";
import cloudinary from "../utilities/cloudinary.js";
import { sendEmail } from "../utilities/email.js";

const router = express.Router();
const uploadSingle = upload.single("image");

// Public Routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

// File upload route for testing
router.post("/upload", uploadSingle, (req, res, next) => {
  cloudinary.uploader.upload(req.file.path, (err, result) => {
    if (err) {
      return next(new AppError("Error uploading image", 500));
    }
    res.status(200).json({
      status: "success",
      message: "Uploaded Successfully!",
      result,
    });
  });
});
router.post("/mail", sendEmail);

// Resize user photo
router.post("/resize", uploadSingle, userController.resizeUserPhoto);

// Protect all routes after this middleware
router.use(authController.protect);

// Current user routes
router.get("/me", userController.getMe, userController.getUser);
router.patch("/updateMyPassword", authController.updatePassword);
router.patch(
  "/updateMe",
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe
);
router.delete("/deleteMe", userController.deleteMe);

// Restrict to admin and manager
router.use(authController.restrictTo("admin", "manager"));

router.post("/insertMany", userController.insertUsers);
router.get("/", userController.getAllUsers);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
