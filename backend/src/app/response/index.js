const { userListData, messages } = require("./response");
module.exports.userList = (req, lists) => {
  if (req.params.id) {
    return userListData(req, lists);
  } else {
    return lists.map((list) => userListData(req, list));
  }
};
module.exports.chatMessage = (req, chats) => {
  return chats.map((chat) => messages(req, chat));
};
