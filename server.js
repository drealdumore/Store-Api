import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";

// TO SEND THE CONFIG TO THE PROCESS.ENV
dotenv.config({ path: "./config.env" });

// Replace password with the actual password
const DB = process.env.DATABASE_LOCAL_IP;

// const DB = process.env.DATABASE.replace(
//   "<PASSWORD>",
//   process.env.DATABASE_PASSWORD
// );

// mongoose
//   .connect(DB, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//   })
//   .then(async () => {
//     console.log("DB connection successful!");
//   })
//   .catch(() => {
//     console.log("error occured while connecting to DB");
//     console.log(DB);
//   });

mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then(async () => {
    console.log("DB connection successful!");
  })
  .catch((error) => {
    console.log("Error connecting to DB:", error);
  });

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product must have a name"],
  },
  category: String,
  color: String,
  description: String,
  image: String,
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

// testProduct.save().then((doc) => {
//   console.log(doc);
// }).catch((err) => {
//   console.log('error: ', err);
// });

// module.exports = Product;

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(process.env.NODE_ENV);
});
