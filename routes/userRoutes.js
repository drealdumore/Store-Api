import express from "express";
import * as userController from "../controllers/userController.js";

const router = express.Router();

// USER ROUTES
router.route("/").get(userController.getAllUsers);
router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
