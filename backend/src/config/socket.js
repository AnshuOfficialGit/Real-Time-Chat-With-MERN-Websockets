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
      io.emit("user_online", { userId });
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
      io.to(receiver_id).emit("receive_message", messageSend);
    });

    socket.on("is_typing", (data) => {
      const { receiver_id, sender_id } = data;
      console.log(`Typing event from ${sender_id} to ${receiver_id}`);

      // Notify the receiver that sender is typing
      io.to(receiver_id).emit("user_typing", {
        senderId: sender_id,
        isTyping: true,
      });

      // Auto-clear typing status after 3 seconds of inactivity
      setTimeout(() => {
        io.to(receiver_id).emit("user_typing", {
          senderId: sender_id,
          isTyping: false,
        });
      }, 3000);
    });

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
}

module.exports = setupSocket;
