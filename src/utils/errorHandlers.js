const logger = require("./../config/logger");
// 404 Not Found Handler
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    status: "error",
    message: `Route ${req.originalUrl} not found`,
  });
};

// Global Error Handler
const errorHandler = (err, req, res, next) => {
  logger.error(err.stack);
  res.status(err.statusCode || 500).json({
    status: "error",
    message: err.message || "Internal Server Error",
  });
};

module.exports = { notFoundHandler, errorHandler };
