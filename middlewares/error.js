module.exports = (err, req, res, next) => {
  // if (process.env.NODE_ENV === "development") {
  //   console.log(err);
  // }

  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    err.statusCode = 400;
    err.message = err.errors[0].message;
  }

  if (err.name === "TokenExpiredError") {
    err.statusCode = 401;
  }

  if (err.name === "JsonWebTokenError") {
    err.statusCode = 401;
  }

  res.status(err.statusCode || 500).json({ message: err.message });
};
