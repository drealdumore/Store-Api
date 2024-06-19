import express from "express";
import * as userController from "../controllers/userController.js";
import * as authController from "../controllers/authController.js";

const router = express.Router();

// USER ROUTES
// router.post("/signup", authController.signup);

router.post("/insertMany", userController.insertUsers);

router.route("/signup").post(authController.signup);
router.route("/login").post(authController.login);
router.route("/logout").get(authController.logout);

router.route("/").get(userController.getAllUsers);
router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

// ADMIN ROUTES
// router.route('/admin').get(userController.getAllAdmin)
// router.route('/admin:id').get(userController.getAdmin)

export default router;

