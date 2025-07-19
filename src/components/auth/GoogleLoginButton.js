import React from "react";

const apiUrl = process.env.REACT_APP_API_URL;

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${apiUrl}auth/google`;
  };

  return <button onClick={handleGoogleLogin}>Login with Google</button>;
};

export default GoogleLoginButton;
