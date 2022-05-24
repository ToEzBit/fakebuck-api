const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file);
    // cb("Error", "public/images")
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + "." + file.mimetype.split("/")[1]);
  },
});

module.exports = multer({ storage });
