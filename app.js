import path from "path";
import { fileURLToPath } from "url";

import express from "express";
import morgan from "morgan";

import productRouter from "./routes/productRoutes.js";
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";

import globalErrorHandler from "./controllers/errorController.js";
import AppError from "./utilities/appError.js";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// MIDDLEWARES works only when req is made

// to parse the incoming request data to json
app.use(express.json());

app.use(express.static(path.join(__dirname, "assets")));

// displays request data in the console.
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ROUTES
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter);

// UNDEFINEND ROUTES
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!.`, 404));
});

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

export default app;
