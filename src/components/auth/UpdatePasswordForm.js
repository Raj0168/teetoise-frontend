import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LoginForm.scss";
import { axiosInstance } from "../../axiosInstance";


const UpdatePasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");
    setResetToken(token);
  }, []);

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
      );
      return;
    }

    try {
      const response = await axiosInstance.post(`/auth/update-password`, {
        resetToken,
        newPassword: password,
      });

      if (response.status === 200) {
        setSuccess("Congrats! Your password has been reset successfully.");
        setError("");
      }
    } catch (error) {
      setError("Failed to update password. Please try again.");
      console.error("Password update failed", error);
    }
  };

  return (
    <Container fluid className="login-page">
      <Row className="d-flex align-items-center">
        <Col md={6} className="login-image-col">
          <img
            src="https://storage.googleapis.com/turtleman-primary-bucket/public_images/website_stuff/login_hero_image.webp"
            alt="Fashion"
            className="login-image"
            loading="lazy"
          />
        </Col>
        <Col md={6} className="login-form-col">
          <div className="login-form-wrapper">
            <h2 className="text-center mb-4">Reset Password</h2>
            <p className="text-center mb-4">
              Enter your new password to reset your account password
            </p>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>New Password</Form.Label>
                <div className="password-wrapper">
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your new password"
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

              <Form.Group className="mb-4" controlId="formBasicConfirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <div className="password-wrapper">
                  <Form.Control
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <i
                    className={`eye-icon ${
                      showConfirmPassword ? "eye-open" : "eye-closed"
                    }`}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                </div>
              </Form.Group>

              <button type="submit" className="login-button w-100 mb-3">
                Reset Password
              </button>

              {success && (
                <div className="text-center">
                  <Button
                    variant="primary"
                    onClick={() => navigate("/auth/login")}
                  >
                    Go to Login
                  </Button>
                </div>
              )}
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default UpdatePasswordForm;
