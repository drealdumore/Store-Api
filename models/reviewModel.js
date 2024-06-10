import { Schema, model } from "mongoose";

const ReviewSchema = new Schema(
  {
    product: {
      type: Schema.ObjectId,
      ref: "Product",
      required: [true, "Review must be associated with a product"],
    },

    user: {
      type: Schema.ObjectId,
      ref: "User",
      required: [true, "Review must be associated with a user"],
    },

    rating: {
      type: Number,
      required: [true, "Please provide a rating"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },

    comment: {
      type: String,
      trim: true,
      required: [true, "Please provide a review comment"],
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  // Ensures virtuals are included when converting the schema to JSON
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 1 user && 1 tour
ReviewSchema.index({ tour: 1, user: 1 }, { unique: true, index: true });
// sort slug in ascending order
ReviewSchema.index({ slug: 1 });

// populate the user prop with name and photo
ReviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name, photo",
  });
  next();
});

const Review = model("Review", ReviewSchema);

export default Review;
