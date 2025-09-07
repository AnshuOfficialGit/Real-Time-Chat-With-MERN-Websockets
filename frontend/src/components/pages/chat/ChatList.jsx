import React, { useEffect, useState, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import UserService from "../../services/users/UserService";
import ChatService from "../../services/socket";
import loginImage from "../../../assets/login-img.png";
import moment from "moment";

const ChatList = () => {
  const { id } = useParams();
  const senderId = JSON.parse(localStorage.getItem("user"));

  const [users, setUsers] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const chatContainerRef = useRef(null);

  const fetchUsers = async () => {
    try {
      const response = await UserService.getUser(id);
      // console.log(response.data.data);
      setUsers(response?.data?.data || []);
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

  // Scroll chat to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Join socket room for this user
  useEffect(() => {
    ChatService.socket.emit("join", senderId);
  }, [senderId]);

  // Listen for incoming messages
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

    // Cleanup old listener
    return () => {
      ChatService.socket.off("receive_message", handleMessage);
    };
  }, [id, senderId]);

  useEffect(() => {
    fetchUsers();
    fetchMessages();
  }, [id]);

  // Formik for sending messages
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

      // Temporary message for instant UI feedback
      const tempMessage = {
        ...values,
        tempId: Date.now(),
        chat_time: moment().format("DD-MM-YYYY hh:mm A"),
      };

      setChatMessages((prev) => [...prev, tempMessage]);

      // Send message to server
      ChatService.sendMessages(values);

      resetForm();
    },
  });

  return (
    <div
      className="container-fluid vh-75 card shadow-lg"
      style={{ height: "75vh", width: "90%" }}
    >
      <div className="row h-100">
        {/* User List */}
        <div className="col-3 border-end bg-light p-3 d-flex flex-column">
          <h5 className="mb-3 text-center">Chat With</h5>

          {/* Chat Partner Info */}
          <div className="text-center mb-4">
            <img
              src={loginImage}
              alt="asdf"
              className="rounded-circle mb-2"
              width="80"
              height="80"
            />
            <h5>{users.name}</h5>
            <p className="mb-1">
              <strong>Email:</strong> {users.email}
            </p>
            <p>
              <strong>Mobile:</strong> {users.mobile}
            </p>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="col-9 d-flex flex-column p-3">
          <div className="d-flex align-items-center justify-content-between border-bottom pb-2 mb-2">
            <div>
              <h6 className="mb-0">
                Chat with <b>{users.name}</b>
              </h6>
              <small className="text-success">Online</small>
            </div>
            <button className="btn btn-sm btn-outline-secondary">⋮</button>
          </div>

          <div
            ref={chatContainerRef}
            className="flex-grow-1 overflow-auto mb-3"
            style={{ maxHeight: "55vh" }}
          >
            {chatMessages.map((msg, index) => {
              const isSentByLoggedInUser =
                msg.sender_id.toString() === senderId.toString();
              return (
                <div
                  key={msg.tempId || msg._id || index}
                  className={`d-flex mb-2 ${
                    isSentByLoggedInUser
                      ? "justify-content-end"
                      : "justify-content-start"
                  }`}
                >
                  <div
                    className={`p-2 rounded ${
                      isSentByLoggedInUser
                        ? "bg-secondary text-dark"
                        : "bg-primary text-white"
                    }`}
                  >
                    {msg.message}
                    <br />
                    <small
                      className={`${
                        isSentByLoggedInUser ? "text-dark" : "text-white"
                      }`}
                    >
                      {msg.chat_time}
                    </small>
                  </div>
                </div>
              );
            })}
          </div>

          <form onSubmit={formik.handleSubmit} autoComplete="off">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Type a message..."
                name="message"
                onChange={formik.handleChange}
                value={formik.values.message}
              />
              <button type="submit" className="btn btn-primary">
                Send
              </button>
            </div>
            {formik.errors.message && (
              <span className="text-danger">{formik.errors.message}</span>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
