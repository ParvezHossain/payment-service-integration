require("dotenv").config(); // Load environment variables from a .env file
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const xssClean = require("xss-clean");
const hpp = require("hpp");
const compression = require("compression");
const paymentRoutes = require("./routes/paymentRoutes");
const { notFoundHandler, errorHandler } = require("../utils/errorHandlers");

// import database configuration
const db = require("../config/database");

const app = express();

// Security Middleware
app.use(helmet()); // Secure HTTP headers
app.use(cors({ origin: process.env.ALLOWED_ORIGINS || "*" })); // Enable CORS
app.use(xssClean()); // Prevent XSS attacks
app.use(hpp()); // Prevent HTTP Parameter Pollution
app.use(compression()); // Compress response bodies

// Rate Limiting (Limit repeated requests to public APIs)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.MAX_REQUEST_PER_15_MINS, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use(limiter);

// Logging Middleware
app.use(morgan("combined")); // Use 'combined' for detailed logs

// Body Parser Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Payment Routes
app.use("/api/v1/payments", paymentRoutes); // Mount payment routes

// Error Handling Middleware
app.use(notFoundHandler); // Handle 404 errors
app.use(errorHandler); // Custom error handler for other errors

module.exports = app;
