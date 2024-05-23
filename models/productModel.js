import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a product name"],
    trim: true, // Removes leading/trailing whitespace
    maxlength: [100, "Product name cannot exceed 100 characters"],
  },

  category: [
    {
      type: String,
      required: [true, "Please select a product category"],
      // enum: ["Gowns", "Tops", "Accessories", "Other"],
    },
  ],

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
  },

  size: String,

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
      type: mongoose.Schema.Types.ObjectId,
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
});

const Product = mongoose.model("Product", ProductSchema);

export default Product;
