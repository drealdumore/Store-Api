import Review from "../models/reviewModel.js";
import * as factory from "./factoryController.js";

export const setProductUserIDs = (req, res, next) => {
  // allow NESTED routes
  if (!req.body.product) req.body.product = req.params.productID;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};

export const getAllReviews = factory.getAll(Review);
export const getReview = factory.getOne(Review);
export const createReview = factory.createOne(Review);
export const updateReview = factory.updateOne(Review);
export const deleteReview = factory.deleteOne(Review);
