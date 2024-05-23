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







const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(process.env.NODE_ENV);
});
