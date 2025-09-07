const { Server } = require("socket.io");
const moment = require("moment");
const Chat = require("../app/models/Chat");

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`A new user connected: ${socket.id}`);

    // User joins their own room
    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined their room`);
    });

    socket.on("send_messages", async (data) => {
      const { receiver_id, message, sender_id } = data;

      const chatData = {
        sender_id,
        receiver_id,
        message,
        chat_time: moment().format("DD-MM-YYYY hh:mm A"),
      };

      const messageSend = await Chat.create(chatData);

      // Emit only to the receiver
      io.to(receiver_id).emit("receive_message", messageSend);

      // Do NOT emit to sender (sender already has temp message)
    });
  });

  return io;
}

module.exports = setupSocket;
