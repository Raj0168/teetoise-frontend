import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../axiosInstance";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LoginForm.scss";
import clothingImage from "../../assets/images/forgot_image.jpg";

const RESEND_TIME_LIMIT = 120;

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(`/auth/reset-password`, {
        email,
      });

      if (response.status === 200) {
        setSuccess(
          `An email has been sent to ${email} with instructions to reset your password.`
        );
        setError("");
        setCountdown(RESEND_TIME_LIMIT);
      }
    } catch (error) {
      setError(`${error?.response?.data?.error}`);
      console.error("Reset password request failed", error);
    }
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer); 
    }
  }, [countdown]);

  const renderCountdownButton = () => {
    if (countdown > 0) {
      return (
        <Button variant="secondary" className="w-100 mb-3" disabled>
          Resend Link in {countdown} seconds
        </Button>
      );
    }
    return (
      <button type="submit" className="login-button w-100 mb-3">
        Send Reset Link
      </button>
    );
  };

  return (
    <Container fluid className="login-page">
      <Row className="d-flex align-items-center">
        <Col md={6} className="login-image-col">
          <img
            src={clothingImage}
            alt="Fashion"
            className="login-image"
            loading="lazy"
          />
        </Col>
        <Col md={6} className="login-form-col">
          <div className="login-form-wrapper">
            <h2 className="text-center mb-4">Forgot Password</h2>
            <p className="text-center mb-4">
              Enter your email to receive a password reset link
            </p>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={countdown > 0} 
                />
              </Form.Group>

              {renderCountdownButton()}

              <div className="other_links">
                <div>
                  <p>Remember your password?</p>
                  <Button
                    variant="link"
                    onClick={() => navigate("/auth/login")}
                  >
                    Login here
                  </Button>
                  <p style={{ fontSize: "12px" }}>
                    If issue persists, feel free to connect with us!
                  </p>
                </div>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ForgotPasswordForm;
