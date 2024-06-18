import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import morgan from "morgan";

import productRouter from "./routes/productRoutes.js";
import userRouter from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import categoryRouter from "./routes/categoryRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";

import globalErrorHandler from "./controllers/errorController.js";
import AppError from "./utilities/appError.js";

// Determine the __dirname equivalent for ES Modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:8000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// MIDDLEWARES

// Parse incoming request data as JSON
app.use(express.json());

// Serve static files from the assets directory
app.use(express.static(path.join(__dirname, "assets")));

// Log requests to the console in development mode
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ROUTES
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/reviews", reviewRouter);

// Handle undefined routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

export default app;
