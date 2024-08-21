require("dotenv").config(); // Load environment variables from a .env file
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const sqlite3 = require("sqlite3").verbose();
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const xssClean = require("xss-clean");
const hpp = require("hpp");
const compression = require("compression");
const paymentRoutes = require("./routes/paymentRoutes");
const { notFoundHandler, errorHandler } = require("./utils/errorHandlers");

const app = express();

// Create and configure SQLite database
const db = new sqlite3.Database(":memory:");

// Create the table
db.serialize(() => {
  db.run(`
    CREATE TABLE records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      transaction_id TEXT NOT NULL,
      tnx_id TEXT NOT NULL,
      details TEXT NOT NULL
    )
  `);
});

// Security Middleware
app.use(helmet()); // Secure HTTP headers
app.use(cors({ origin: process.env.ALLOWED_ORIGINS || "*" })); // Enable CORS
app.use(xssClean()); // Prevent XSS attacks
app.use(hpp()); // Prevent HTTP Parameter Pollution
app.use(compression()); // Compress response bodies

// Rate Limiting (Limit repeated requests to public APIs)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use(limiter);

// Logging Middleware
app.use(morgan("combined")); // Use 'combined' for detailed logs

// Body Parser Middleware
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Static Files (if needed)
app.use(express.static("public")); // Serve static files from the 'public' directory

// Payment Routes
app.use("/api/v1/payments", paymentRoutes); // Mount payment routes

// Error Handling Middleware
app.use(notFoundHandler); // Handle 404 errors
app.use(errorHandler); // Custom error handler for other errors

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});

module.exports = app;
