require("dotenv").config();
const express = require("express");
const app = express();
const helmet = require("helmet");
const cors = require("cors");
const apiRoutes = require("../routes");
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
  })
);
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", apiRoutes);
module.exports = app;
