import React, { useContext } from "react";
import loginImage from "../../../assets/login-img.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import AuthService from "../../services/auth/authService";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context";
const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const initialValues = {
    email: "",
    password: "",
  };
  const validationSchema = Yup.object({
    email: Yup.string().required("Email is required").email("Email is invalid"),
    password: Yup.string().required("Password is required"),
  });
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit(values) {
      AuthService.loginService(values).then(
        (response) => {
          // console.log(response.data.data);
          login(response?.data?.data, response?.data?.data?.token);
          navigate("/users");
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          console.log(resMessage);
        }
      );
    },
  });
  return (
    <>
      <div className="row mt-5">
        <div className="col-md-6">
          <img src={loginImage} alt="" style={{ height: "400px" }} />
        </div>
        <div className="col-md-6">
          <form onSubmit={formik.handleSubmit}>
            <fieldset>
              <legend className="text-center">Login</legend>
              <hr />
              <div className="form-group mb-3">
                <label for="email" className="form-label">
                  Email address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  placeholder="Enter email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
                {formik.errors.email ? (
                  <span name="error" className="text-danger error">
                    {formik.errors.email}
                  </span>
                ) : null}
              </div>
              <div className="form-group mb-3">
                <label for="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="Password"
                  name="password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                />
                {formik.errors.password ? (
                  <span name="error" className="text-danger error">
                    {formik.errors.password}
                  </span>
                ) : null}
              </div>
              <div className="form-group">
                <div className="d-flex justify-content-end">
                  <button type="submit" className="btn btn-primary col-md-12">
                    Login
                  </button>
                </div>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </>
  );
};
export default Login;
