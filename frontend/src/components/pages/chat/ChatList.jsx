import React, { useEffect, useState, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import UserService from "../../services/users/UserService";
import ChatService from "../../services/socket";
import loginImage from "../../../assets/login-img.png";
import moment from "moment";
import { io } from "socket.io-client";
import { wsURL } from "../../axios/endPoint";
const ChatList = () => {
  const { id } = useParams(); // receiver_id
  const senderId = JSON.parse(localStorage.getItem("user")); // logged-in user ID

  const [users, setUsers] = useState({});
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(false);
  const chatContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  // const [isConnected, setIsConnected] = useState(false);

  const updateSocket = async (id) => {
    try {
      const data = {
        socket_id: id,
      };
      await UserService.updateSocketService(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const socket = io(wsURL, {
      transports: ["websocket"],
    });
    socket.on("connect", () => {
      updateSocket(socket.id);
    });
    socket.on("disconnect", () => {});
    return () => {
      socket.disconnect();
    };
  }, []);
  const fetchUsers = async () => {
    try {
      const response = await UserService.getUser(id);
      setUsers(response?.data?.data || {});
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await ChatService.getMessages(id);
      setChatMessages(response.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    ChatService.socket.emit("join", senderId);
    ChatService.socket.emit("user_online", { userId: senderId });

    return () => {
      ChatService.socket.emit("user_offline", { userId: senderId });
    };
  }, [senderId]);

  useEffect(() => {
    const handleUserOnline = (data) => {
      if (data.userId.toString() === id.toString()) setIsOnline(true);
    };

    const handleUserOffline = (data) => {
      if (data.userId.toString() === id.toString()) setIsOnline(false);
    };

    const handleTyping = (data) => {
      if (data.senderId.toString() === id.toString()) {
        setIsTyping(data.isTyping);

        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        typingTimeoutRef.current = setTimeout(() => {
          setIsTyping(false);
        }, 3000);
      }
    };

    ChatService.socket.on("user_online", handleUserOnline);
    ChatService.socket.on("user_offline", handleUserOffline);
    ChatService.socket.on("user_typing", handleTyping);

    return () => {
      ChatService.socket.off("user_online", handleUserOnline);
      ChatService.socket.off("user_offline", handleUserOffline);
      ChatService.socket.off("user_typing", handleTyping);
    };
  }, [id]);

  useEffect(() => {
    const handleMessage = (msg) => {
      const isRelevant =
        (msg.sender_id.toString() === id.toString() &&
          msg.receiver_id.toString() === senderId.toString()) ||
        (msg.sender_id.toString() === senderId.toString() &&
          msg.receiver_id.toString() === id.toString());

      if (isRelevant) setChatMessages((prev) => [...prev, msg]);
    };

    ChatService.onReceiveMessage(handleMessage);

    return () => {
      ChatService.socket.off("receive_message", handleMessage);
    };
  }, [id, senderId]);

  useEffect(() => {
    fetchUsers();
    fetchMessages();
  }, [id]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      message: "",
      receiver_id: id || "",
      sender_id: senderId || "",
    },
    validationSchema: Yup.object({
      message: Yup.string().required("Chat message cannot be blank!"),
    }),
    onSubmit: (values, { resetForm }) => {
      if (!values.message) return;

      const tempMessage = {
        ...values,
        tempId: Date.now(),
        chat_time: moment().format("DD-MM-YYYY hh:mm A"),
      };

      setChatMessages((prev) => [...prev, tempMessage]);
      ChatService.sendMessages(values);
      resetForm();
    },
  });

  const handleTypingEvent = (e) => {
    formik.handleChange(e);
    ChatService.socket.emit("is_typing", {
      sender_id: senderId,
      receiver_id: id,
      isTyping: true,
    });
  };

  return (
    <div
      className="container-fluid vh-75 card shadow-lg"
      style={{ height: "75vh", width: "90%" }}
    >
      <div className="row h-100">
        <div className="col-3 border-end bg-light p-3 d-flex flex-column align-items-center">
          <h5 className="mb-3 text-center">Chat With</h5>

          <img
            src={loginImage}
            alt="avatar"
            className="rounded-circle mb-2"
            width="80"
            height="80"
          />
          <h5>{users.name}</h5>
          <p>
            <strong>Email:</strong> {users.email}
          </p>
          <p>
            <strong>Mobile:</strong> {users.mobile}
          </p>
          <small
            className={`badge ${isOnline ? "bg-success" : "bg-secondary"}`}
          >
            {/* {isOnline ? "Online" : "Offline"} */}
          </small>
        </div>

        <div className="col-9 d-flex flex-column p-3">
          <div className="d-flex justify-content-between align-items-center border-bottom mb-2 pb-2">
            <h6>
              Chatting with <b>{users.name}</b>
              <br />
              {isTyping && <small className="text-success">Typing...</small>}
            </h6>
          </div>

          <div
            ref={chatContainerRef}
            className="flex-grow-1 overflow-auto mb-3"
            style={{ maxHeight: "55vh" }}
          >
            {chatMessages.map((msg, index) => {
              const isSentByUser =
                msg.sender_id.toString() === senderId.toString();
              return (
                <div
                  key={msg.tempId || msg._id || index}
                  className={`d-flex mb-2 ${
                    isSentByUser
                      ? "justify-content-end"
                      : "justify-content-start"
                  }`}
                >
                  <div
                    className={`p-2 rounded ${
                      isSentByUser
                        ? "bg-secondary text-dark"
                        : "bg-primary text-white"
                    }`}
                  >
                    {msg.message}
                    <br />
                    <small
                      className={isSentByUser ? "text-dark" : "text-white"}
                    >
                      {msg.chat_time}
                    </small>
                  </div>
                </div>
              );
            })}
          </div>

          <form onSubmit={formik.handleSubmit} className="d-flex">
            <input
              type="text"
              name="message"
              className="form-control me-2"
              placeholder="Type your message"
              onChange={handleTypingEvent}
              value={formik.values.message}
            />
            <button type="submit" className="btn btn-primary">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
