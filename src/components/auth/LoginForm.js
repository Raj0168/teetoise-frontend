import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../redux/slices/userSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { axiosInstance } from "../../axiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LoginForm.scss";
import GoogleLoginButton from "./GoogleLoginButton";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters with upper/lower case, numbers, and symbols."
      );
      toast.error("Password does not meet the criteria.");
      return;
    }
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      dispatch(
        login({
          user: response.data.user,
          token: response.data.token,
          refreshToken: response.data.refreshToken,
        })
      );
      setError("");

      toast.success("Login successful!");
      const previousPage = location.state?.from || "/";
      const isInternal = previousPage.startsWith("/");
      navigate(isInternal ? previousPage : "/");
    } catch (error) {
      setError(
        "Login failed. Please check your credentials and try again. If the issue persists, please try again later."
      );
      toast.error("Login failed. Please try again.");
      console.error("Login failed", error);
    }
  };

  return (
    <Container fluid className="login-page">
      <Row className="d-flex align-items-center">
        <Col md={6} className="login-image-col d-none d-md-block">
          <img
            src="https://storage.googleapis.com/turtleman-primary-bucket/public_images/website_stuff/login_hero_image.webp"
            alt="Login"
            className="login-image"
            loading="lazy"
          />
        </Col>
        <Col md={6} className="login-form-col">
          <div className="login-form-wrapper">
            <h2 className="text-center mb-4">Welcome Back!</h2>
            <p className="text-center mb-4">
              Log in to enjoy the full experience.
            </p>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <div className="password-wrapper">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <i
                    className={`eye-icon ${
                      showPassword ? "eye-open" : "eye-closed"
                    }`}
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </div>
              </Form.Group>

              <Button
                type="submit"
                variant="warning"
                className="w-100 mb-3 login-button"
              >
                Login
              </Button>
              <div className="other-links">
                <div className="link-item">
                  <p>New to our platform?</p>
                  <Button
                    variant="link"
                    onClick={() => navigate("/auth/register")}
                  >
                    Register now
                  </Button>
                </div>
                <div className="separator"></div>
                <div className="link-item" style={{ fontSize: "12px" }}>
                  <p>Forgot password?</p>
                  <Button
                    variant="link"
                    onClick={() => navigate("/auth/forgot-password")}
                  >
                    Reset here
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;
