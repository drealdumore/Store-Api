import {Schema, model} from "mongoose";
import slugify from "slugify";

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter a product name"],
      trim: true, // Removes leading/trailing whitespace
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },

    slug: String,


    category: {
      type: Schema.ObjectId,
      ref: "Category",
      required: [true, "Please select a product category"],
    },

    description: {
      type: String,
      required: [true, "Please provide a product description"],
      trim: true,
    },

    color: {
      type: String,
      default: "Available in different colors",
    },

    coverImage: {
      type: String,
      // required: [true, "Please upload a product cover image"],
    },

    images: [String],

    price: {
      type: Number,
      required: [true, "Please enter a product price"],
    },

    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: "Discount price {{VALUE}} should be below regular price",
      },
    },

    size: { type: String },

    inStock: {
      type: Boolean,
      default: true,
    },

    quantity: {
      type: Number,
      default: 10,
      min: [0, "Quantity cannot be negative"],
    },

    size: {
      type: String,
      // enum: ["S", "M", "L", "XL", "One Size"],
    },

    brand: {
      type: String,
      required: false,
    },

    reviews: [
      {
        type: Schema.ObjectId,
        ref: "Review", // Reference Review model
      },
    ],

    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating cannot be negative"],
      max: [5, "Rating cannot exceed 5"],
    },

    numReviews: {
      type: Number,
      default: 0,
    },

    createdAt: {
      type: Date,
      default: Date.now, // Automatically set creation date
    },
  },
  {
    // to include virtual fields when schema is in JSON
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// used post b4
ProductSchema.get(/^find/, function (next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

// QUERY INDEXES
ProductSchema.index({ slug: 1 });
ProductSchema.index({ price: 1 });

// CREATE slug with NAME
ProductSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Product = model("Product", ProductSchema);

export default Product;
