function errorHandler(error, req, res, next) {
  console.error("Unhandled error:", error);
  if (res.headersSent) {
    return next(error);
  }

  res.status(500).json({
    error: "Something went wrong. Please try again later."
  });
}

module.exports = errorHandler;
