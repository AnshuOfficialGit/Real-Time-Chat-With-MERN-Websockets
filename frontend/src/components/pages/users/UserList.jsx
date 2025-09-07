import React, { useEffect, useState } from "react";
import UserService from "../../services/users/UserService";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import { wsURL } from "../../axios/endPoint";
const UserList = () => {
  const [user, setUser] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const fetchUser = async () => {
    try {
      const response = await UserService.userList();
      setUser(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };
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
      setIsConnected(true);
      updateSocket(socket.id);
    });
    socket.on("disconnect", () => {
      setIsConnected(false);
    });
    return () => {
      socket.disconnect();
    };
  }, []);
  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <>
      <div className="row">
        <div className="table-responsive mt-5">
          <p>Status: {isConnected ? "🟢 Connected" : "🔴 Disconnected"}</p>
          <table class="table table-hover ">
            <thead>
              <tr class="table-primary">
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Mobile</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {user.map((item, index) => (
                <tr key={item.id || index}>
                  <td scope="row">{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.mobile}</td>
                  <td>
                    <Link to={`/chat-list/${item.id}`}>Chat</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
export default UserList;
