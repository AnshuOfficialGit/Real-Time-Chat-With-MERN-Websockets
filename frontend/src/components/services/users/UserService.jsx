import axiosInstance from "../../axios/axiosInstance";
import {
  baseURL,
  users,
  updateSocketId,
  singleUser,
} from "../../axios/endPoint";

const userList = async () => {
  try {
    const result = await axiosInstance.get(`${baseURL}${users}`);
    return result;
  } catch (error) {
    return error;
  }
};
const updateSocketService = async (data) => {
  try {
    const result = await axiosInstance.post(
      `${baseURL}${updateSocketId}`,
      data
    );
    return result;
  } catch (error) {
    return error;
  }
};

const getUser = async (id) => {
  try {
    const result = await axiosInstance.get(`${baseURL}${singleUser}/${id}`);
    return result;
  } catch (error) {
    return error;
  }
};

const UserService = {
  userList,
  updateSocketService,
  getUser,
};
export default UserService;
