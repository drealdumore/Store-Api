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
});

const Category = mongoose.model("Category", CategorySchema);

export default Category;



// so how best??
//  should the child know of the parent 
// or the parent should know of the child
// i want it t