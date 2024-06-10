import express from "express";
import * as reviewController from "./../controllers/reviewController.js";
import * as authController from "./../controllers/authController.js";

// to be able to use productID from product Routes
const router = express.Router({ mergeParams: true });

// only Authenticated Users can write review -- middleware
// Works on all routes.
router.use(authController.protect);

router
  .route("/")
  .get(reviewController.getAllReviews)
  .post(reviewController.createReview);

router
  .route("/:id")
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo("user", "admin"),
    reviewController.updateReview
  )
  .delete(
    authController.restrictTo("user", "admin"),
    reviewController.deleteReview
  );

export default router;
