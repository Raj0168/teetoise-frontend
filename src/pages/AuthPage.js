import React from "react";
import { useLocation } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm.js";
import UpdatePasswordForm from "../components/auth/UpdatePasswordForm.js";
import UserDetailsForm from "../components/auth/UserDetailsForm";
import './AuthPage.scss';

const AuthPage = () => {
  const location = useLocation();
  const path = location.pathname.split("/").pop();

  const renderForm = () => {
    switch (path) {
      case "login":
        return <LoginForm />;
      case "register":
        return <RegisterForm />;
      case "forgot-password":
        return <ForgotPasswordForm />;
      case "update-password":
        return <UpdatePasswordForm />;
      case "user-details":
        return <UserDetailsForm />;
      default:
        return <LoginForm />;
    }
  };

  return (
    <div className="auth-page">
      {/* <div className="auth-header">{path.replace("-", " ")}</div> */}
      {renderForm()}
    </div>
  );
};

export default AuthPage;
