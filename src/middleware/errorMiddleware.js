const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
};

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid Id Format",
    });
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: message.join(","),
    });
  }
};

module.exports = { notFound, errorHandler };
