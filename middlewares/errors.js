const ErrorHandler = require("../Utils/ErrorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "development") {
    res.status(err.statusCode).json({
      success: false,
      error: err,
      errMessage: err.message,
      stack: err.stack,
    });
  }

  if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    error.message = err.message;

    // Wrong mongoose object ID error
    if (err.name === "CastError") {
      const message = `Resource not found. Invalid ${err.path}`;
      error = new ErrorHandler(message, 404);
    }

    // Handling Mongoose Validation error
    // e.g. missing fields in post request
    if (err.name === "ValidationError") {
      const message = Object.values(err.errors).map((value) => value.message);
      error = new ErrorHandler(message, 400);
    }

    // Handle mongoose duplicate key error
    if (err.code === 11000) {
      const message = `Duplicate key ${Object.keys(err.keyValue)} entered`;
      error = newErrorHandler(message, 400);
    }

    res.status(error.statusCode).json({
      success: false,
      errMessage: error.message || "Internal Server Error",
    });
  }
};
