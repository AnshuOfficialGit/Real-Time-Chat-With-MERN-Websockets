import { io } from "socket.io-client";
import { baseURL, getChatMessage, wsURL } from "../../axios/endPoint";
import axiosInstance from "../../axios/axiosInstance";

const socket = io(wsURL);

const sendMessages = async (data) => {
  console.log("Chat Message At Service:", data);
  await socket.emit("send_messages", data);
};

const getMessages = async (receiver_id) => {
  try {
    const result = await axiosInstance.get(
      `${baseURL}${getChatMessage}/${receiver_id}`
    );
    return result;
  } catch (error) {
    return error;
  }
};

const onReceiveMessage = (callback) => {
  socket.on("receive_message", callback);
};

const isOnline = async (data) => {
  await socket.on("is_online", data);
};

const ChatService = {
  socket,
  sendMessages,
  getMessages,
  onReceiveMessage,
  isOnline,
};

export default ChatService;
