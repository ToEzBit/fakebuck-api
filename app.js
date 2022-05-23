require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const notFoundMiddleware = require("./middlewares/notFound");
const errorMiddleware = require("./middlewares/error");

const authRoute = require("./routes/authRoute");

const app = express();

app.use(cors());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", authRoute);

app.use(notFoundMiddleware);
app.use(errorMiddleware);
const port = process.env.PORT || 8000;
app.listen(port, () =>
  console.log(`sever is running on port ${process.env.PORT}`)
);
