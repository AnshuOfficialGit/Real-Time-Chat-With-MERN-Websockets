const express = require("express");
const helpers = require("../app/helpers");
const router = express.Router();

router.get("/test", (req, res) => {
  return helpers.response(res, 200, true, "API is running...", {});
});

router.use("/api", require("./api"));
module.exports = router;
