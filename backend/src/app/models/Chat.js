const mongoose = require("mongoose");
const ChatSchema = mongoose.Schema(
  {
    sender_id: { type: String, default: null },
    receiver_id: { type: String, default: null },
    message: {
      type: String,
      default: null,
    },
    is_read: {
      type: Boolean,
      default: false,
    },
    chat_time: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);
const Chat = mongoose.model("Chat", ChatSchema);
module.exports = Chat;
