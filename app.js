import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import ExpressMongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";

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

// app.enable("trust proxy");

// MIDDLEWARES

// CORS configuration
// const corsOptions = {
//   origin: process.env.CLIENT_URL || "http://localhost:8000",
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   preflightContinue: false,
//   optionsSuccessStatus: 204,
//   allowedHeaders: ["Content-Type", "Authorization"],
// };

// app.use(cors(corsOptions));

// CORS
app.use(cors());

app.options("*", cors());

// Parse incoming request data as JSON
app.use(express.json());

// Serve static files from the assets directory
app.use(express.static(path.join(__dirname, "assets")));

// Set security HTTP headers
app.use(helmet());

// Log requests to the console in development mode
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Rate limiting to prevent brute-force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use("/api", limiter);

app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(ExpressMongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ["price", "category", "rating", "sort", "page", "limit"],
  })
);

app.use(compression());

// ROUTES
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/reviews", reviewRouter);

// HANDLE UNDEFINED ERRORS
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// GLOBAL ERROR HANDLER
app.use(globalErrorHandler);

export default app;
