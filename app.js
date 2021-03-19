let env = process.env.NODE_ENV;

if (env === "development" || env === "test") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const router = require("./routes/index");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

app.use(errorHandler)

module.exports = app;
