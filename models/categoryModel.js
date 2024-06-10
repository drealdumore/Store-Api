import mongoose from "mongoose";
import slugify from "slugify";

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  slug: String,

  description: {
    type: String,
    required: [true, "Please provide category description"],
    trim: true,
  },

  coverImage: {
    type: String,
    // required: [true, "Please upload a product cover image"],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

CategorySchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Category = mongoose.model("Category", CategorySchema);

export default Category;

// 1:many === 1 category can have many product
// so category id will be in the child model.

// so when hard coding and creating it --- i need to create category first
