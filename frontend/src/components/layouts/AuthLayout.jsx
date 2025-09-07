import React from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <>
      <Header />
      <div className="container mt-3">
        <Outlet />
      </div>

      <Footer />
    </>
  );
};

export default AuthLayout;
