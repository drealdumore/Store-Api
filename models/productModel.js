import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product must have a name"],
  },
  category: String,
  color: String,
  description: String,
  coverImage: String,
  images: [String],
  price: {
    type: Number,
    required: [true, "Product must have a price"],
  },
  quantity: {
    type: Number,
    default: 10,
  },
  size: String,
});

const Product = mongoose.model("Product", ProductSchema);

const testProduct = new Product({
  name: "Test Product",
  price: 100,
  description: "Test Product Description",
});

testProduct
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log("error: ", err);
  });

export default Product;
