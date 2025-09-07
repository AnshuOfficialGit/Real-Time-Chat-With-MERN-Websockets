const helpers = require("../helpers");
module.exports.userListData = (req, list) => ({
  id: list.user_id._id,
  name: list.user_id.name,
  email: list.user_id.email,
  mobile: list?.mobile,
  profile_image: list?.profile_image,
  status: helpers.capitalizeFirstLetter(list.user_id.status),
  created_at: helpers.formatDateTime(list.user_id.created_at),
});

module.exports.messages = (req, chat) => ({
  id: chat.id,
  message: chat.message,
  chat_time: chat.chat_time,
  sender_id: chat.sender_id,
  receiver_id: chat.receiver_id,
});
