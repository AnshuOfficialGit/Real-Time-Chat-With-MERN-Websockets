import axiosInstance from "../../axios/axiosInstance";
import { baseURL, login, register } from "../../axios/endPoint";

const loginService = async (data) => {
  try {
    const result = await axiosInstance.post(`${baseURL}${login}`, data);
    return result;
  } catch (error) {
    return error;
  }
};
const RegisterService = async (data) => {
  try {
    const result = await axiosInstance.post(`${baseURL}${register}`, data);
    return result;
  } catch (error) {
    return error;
  }
};

const AuthService = {
  loginService,
  RegisterService,
};
export default AuthService;
