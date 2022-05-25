module.exports = (err, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    console.log(err);
  }
  res.status(500).json({ message: err.message });
};
