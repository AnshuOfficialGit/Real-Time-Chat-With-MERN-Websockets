import React from "react";
import loginImage from "../../../assets/login-img.png";
import { useFormik } from "formik";
import * as Yup from "yup";
import AuthService from "../../services/auth/authService";
import { useNavigate } from "react-router-dom";
const Register = () => {
  const navigate = useNavigate();
  const initialValues = {
    name: "",
    email: "",
    password: "",
    mobile: "",
  };
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().required("Email is required"),
    password: Yup.string().required("Password is required"),
    mobile: Yup.string().required("Mobile is required"),
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit(values) {
      AuthService.RegisterService(values).then(
        (response) => {
          console.log(response);
          navigate("/");
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
              <legend className="text-center">Register</legend>
              <hr />
              <div className="form-group mb-3">
                <label for="email" class="form-label">
                  Name
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="name"
                  placeholder="Enter name"
                  name="name"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                />
                {formik.errors.name ? (
                  <span name="error" className="text-danger error">
                    {formik.errors.name}
                  </span>
                ) : null}
              </div>
              <div className="form-group mb-3">
                <label for="email" class="form-label">
                  Email
                </label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  placeholder="Enter email"
                  name="email"
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
                <label for="password" class="form-label">
                  Password
                </label>
                <input
                  type="password"
                  class="form-control"
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
              <div className="form-group mb-3">
                <label for="email" class="form-label">
                  Mobile
                </label>
                <input
                  type="text"
                  class="form-control"
                  id="mobile"
                  placeholder="Enter mobile"
                  name="mobile"
                  onChange={formik.handleChange}
                  value={formik.values.mobile}
                />
                {formik.errors.mobile ? (
                  <span name="error" className="text-danger error">
                    {formik.errors.mobile}
                  </span>
                ) : null}
              </div>
              <div className="form-group">
                <div className="d-flex justify-content-end">
                  <button type="submit" class="btn btn-primary col-md-12">
                    Register
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
export default Register;
