const helpers = require("../../helpers");
const User = require("../../models/User");
const UserDetails = require("../../models/UserDetails");
const jwt = require("jsonwebtoken");
const config = require("../../../config");
/**
 * Login
 */
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email,
    });
    if (!user) {
      return helpers.response(
        res,
        400,
        false,
        "Credentials does not matched!!",
        {}
      );
    }

    if (user && (await user.comparePassword(password))) {
      const token = jwt.sign(
        { id: user._id, email: user.email },
        config.JWT_SECRET
      );
      user.token = token;
      user.save();
      const data = {
        id: user._id,
        name: user.name,
        email: user.email,
        token: token,
      };
      return helpers.response(res, 201, true, "Login successfully!!", data);
    } else {
      return helpers.response(
        res,
        400,
        false,
        "Credentials does not matched!!",
        {}
      );
    }
  } catch (error) {
    return helpers.response(
      res,
      500,
      false,
      "Internal Server Error.",
      error.message
    );
  }
};

/**
 * Register
 */
module.exports.register = async (req, res) => {
  try {
    const { name, email, password, mobile } = req.body;
    const checkUser = await User.findOne({
      email: email,
    });
    if (checkUser) {
      return helpers.response(
        res,
        400,
        false,
        "Email already been taken!!",
        {}
      );
    }

    const user = await User.create({
      name,
      email,
      password,
      status: "active",
    });
    await UserDetails.create({
      user_id: user._id,
      mobile,
    });
    return helpers.response(res, 201, true, "User Registered Successfully", {});
  } catch (error) {
    return helpers.response(
      res,
      500,
      false,
      "Internal Server Error.",
      error.message
    );
  }
};
