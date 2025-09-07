const helpers = require("../../helpers");
const Chat = require("../../models/Chat");
const Response = require("../../response/");
const mongoose = require("mongoose");
module.exports.messages = async (req, res) => {
  try {
    const receiver_id = req.params.receiver_id;
    const sender_id = req.user.id;

    const chatMessages = await Chat.find({
      $or: [
        { sender_id: sender_id, receiver_id: receiver_id },
        { sender_id: receiver_id, receiver_id: sender_id },
      ],
    }).sort({ created_at: 1 });
    const chats = Response.chatMessage(req, chatMessages);

    return helpers.response(res, 201, true, "Chat Messages!!", chats);
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
