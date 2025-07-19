import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const refreshToken = urlParams.get("refreshToken");

    if (token && refreshToken) {
      // Store tokens in localStorage or context
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);

      // Redirect user to homepage or dashboard
      navigate("/");
    } else {
      // Handle failure or missing tokens
      navigate("/login");
    }
  }, [navigate]);

  return <div>Authenticating...</div>;
};

export default AuthSuccess;
