import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";

// when there is an uncaught exception like
// an error or a promise rejection or logging undefined var
process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXCEPTION 💥 Shutting down...");
  process.exit(1);
});

// TO SEND THE CONFIG TO THE PROCESS.ENV
dotenv.config({ path: "./config.env" });

// Replace password with the actual password
const DB = process.env.DATABASE_LOCAL_IP;

// const DB = process.env.DATABASE.replace(
//   "<PASSWORD>",
//   process.env.DATABASE_PASSWORD
// );

mongoose
  .connect(DB)
  .then(async () => {
    console.log("DB connection successful!");
  })
  .catch((error) => {
    console.log("Error connecting to DB:", error);
  });

const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
  console.log(process.env.NODE_ENV);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name);
  console.log("MESSAGE: ", err.message);
  console.log("UNHANDLED REJECTION 💥 Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});
