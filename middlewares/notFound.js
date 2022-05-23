module.exports = (req, res) => {
  res.status(404).json({ message: "resource not found on this sever" });
};
