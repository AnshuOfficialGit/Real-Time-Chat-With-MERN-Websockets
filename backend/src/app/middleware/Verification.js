const jwt = require("jsonwebtoken");
const User = require("../models/User");
const helpers = require("../helpers");
module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return helpers.response(res, 401, false, "No token provided");
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return helpers.response(res, 401, false, "Invalid token format");
    }
    // verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return helpers.response(res, 401, false, "Token expired or invalid");
    }
    const storedToken = await User.findOne({
      _id: decoded.id,
      token: token,
    });
    if (!storedToken) {
      return helpers.response(
        res,
        401,
        false,
        "Session expired, please login again"
      );
    }
    const user = await User.findById(decoded.id);
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    return helpers.response(
      res,
      500,
      false,
      "Something went wrong!!",
      error.message
    );
  }
};
