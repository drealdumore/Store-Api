import express from "express";
import morgan from "morgan";
import productRouter from "./routes/productRoutes.js";

const app = express();

// MIDDLEWARES works only when req is made

// to parse the incoming request data to json
app.use(express.json());

// displays request data in the console.
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ROUTES
app.use("/api/products", productRouter);

export default app;
