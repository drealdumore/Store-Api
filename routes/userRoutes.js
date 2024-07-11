import express from "express";
import * as userController from "../controllers/userController.js";
import * as authController from "../controllers/authController.js";

import cloudinary from "../utilities/cloudinary.js";
import upload from "../utilities/multer.js";
import AppError from "../utilities/appError.js";

const router = express.Router();

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route("/logout").get(authController.logout);

router.route("/forgotPassword").post(authController.forgotPassword);
router.route("/resetPassword/:token").patch(authController.forgotPassword);





const uploadSingle = upload.single("image");

// Testing Multer && Cloudinary
router.post("/upload", uploadSingle, function (req, res) {
  console.log("start upload");
  cloudinary.uploader.upload(req.file.path, function (err, result) {
    console.log("uploadng...");

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

/////////////////////////////////
router.delete("/deleteMe", userController.deleteMe);

router.post("/insertMany", userController.insertUsers);
router.post("/resize", userController.resizeUserPhoto);


// Protect all routes after this middleware && restrict to admin
router.use(authController.protect);

router.get('/me', userController.getMe, userController.getUser);


router.use(authController.restrictTo("admin"));

// GET all Users
router.route("/").get(userController.getAllUsers);

// GET, UPDATE and DELETE User
router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
