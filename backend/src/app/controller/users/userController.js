const helpers = require("../../helpers");
const User = require("../../models/User");
const UserDetails = require("../../models/UserDetails");
const Response = require("../../response");
module.exports.list = async (req, res) => {
  try {
    const users = await UserDetails.find({
      user_id: { $ne: req.user.id },
    }).populate("user_id");
    if (users.length > 0) {
      const userList = Response.userList(req, users);
      return helpers.response(res, 201, true, "User List", userList);
    } else {
      return helpers.response(res, 400, false, "No User Found", {});
    }
  } catch (error) {
    return helpers.response(
      res,
      500,
      false,
      "Internal Server Errror",
      error.message
    );
  }
};

module.exports.update = async (req, res) => {
  try {
    const result = await User.updateOne(
      { _id: req.user._id },
      { $set: { socket_id: req.body.socketId } }
    );
    if (result) {
      return helpers.response(
        res,
        200,
        true,
        "Socket Id Updated successfully",
        {}
      );
    } else {
      return helpers.response(
        res,
        400,
        false,
        "Unable to update socket Id",
        {}
      );
    }
  } catch (error) {
    return helpers.response(
      res,
      500,
      false,
      "Internal Server Errror",
      error.message
    );
  }
};

module.exports.details = async (req, res) => {
  try {
    const users = await UserDetails.findOne({
      user_id: req.params.id,
    }).populate("user_id");
    if (users) {
      const userList = Response.userList(req, users);
      return helpers.response(res, 201, true, "User List", userList);
    } else {
      return helpers.response(res, 400, false, "No User Found", {});
    }
  } catch (error) {
    return helpers.response(
      res,
      500,
      false,
      "Internal Server Errror",
      error.message
    );
  }
};
