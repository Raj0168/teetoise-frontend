import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { axiosInstance } from "../../axiosInstance";
import AdminHeader from "../../components/admin/AdminHeader";
import "./AdminLogin.scss";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userOtp, setUserOtp] = useState("");
  const [adminOtp, setAdminOtp] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false); // State to toggle between login and register
  const [isVerifying, setIsVerifying] = useState(false); // State to toggle OTP verification
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters with upper/lower case, numbers, and symbols."
      );
      return;
    }
    try {
      const response = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      dispatch(login(response.data));
      navigate("/developer-portal");
    } catch (error) {
      setError(
        "Login failed. Please check your credentials and try again. If the issue persists, please try again later."
      );
      console.error("Login failed", error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters with upper/lower case, numbers, and symbols."
      );
      return;
    }
    try {
      await axiosInstance.post("/auth/register", {
        email,
        password,
        userType: "admin",
      });
      setIsVerifying(true);
    } catch (error) {
      setError(
        "Registration failed. Please check your details and try again. If the issue persists, please try again later."
      );
      console.error("Registration failed", error);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post("/auth/verify-otp", {
        email,
        userOtp,
        adminOtp,
        password,
        userType: "admin",
      });
      if (response.status === 200) {
        // Reset the form state
        setIsVerifying(false);
        setIsRegistering(false);
        setEmail("");
        setPassword("");
        setUserOtp("");
        setAdminOtp("");
        setError("");
        // Switch back to login prompt
        alert("OTP verified successfully! Please log in.");
      }
    } catch (error) {
      setError(
        "OTP verification failed. Please check your OTPs and try again."
      );
      console.error("OTP verification failed", error);
    }
  };

  return (
    <>
      <AdminHeader className="header" />
      <Container fluid className="admin-login">
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
              <h2 className="text-center mb-4">
                {isRegistering
                  ? isVerifying
                    ? "Verify OTP"
                    : "Register"
                  : "Welcome Back!"}
              </h2>
              <p className="text-center mb-4">
                {isRegistering
                  ? isVerifying
                    ? "Enter the OTPs to verify your registration"
                    : "Create your admin account"
                  : "Log in to manage the developer portal"}
              </p>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form
                onSubmit={
                  isRegistering
                    ? isVerifying
                      ? handleVerifyOtp
                      : handleRegister
                    : handleLogin
                }
              >
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isVerifying}
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
                      disabled={isVerifying}
                    />
                    <i
                      className={`eye-icon ${
                        showPassword ? "eye-open" : "eye-closed"
                      }`}
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  </div>
                </Form.Group>

                {isRegistering && isVerifying && (
                  <>
                    <Form.Group className="mb-3" controlId="formBasicUserOtp">
                      <Form.Label>User OTP</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter user OTP"
                        value={userOtp}
                        onChange={(e) => setUserOtp(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="formBasicAdminOtp">
                      <Form.Label>Admin OTP</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter admin OTP"
                        value={adminOtp}
                        onChange={(e) => setAdminOtp(e.target.value)}
                        required
                      />
                    </Form.Group>
                  </>
                )}

                <Button type="submit" className="login-button w-100 mb-3">
                  {isRegistering
                    ? isVerifying
                      ? "Verify"
                      : "Register"
                    : "Login"}
                </Button>
                <div className="other-links">
                  {isRegistering ? (
                    <div>
                      <Button
                        variant="link"
                        onClick={() => setIsRegistering(false)}
                      >
                        Login here
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Button
                        variant="link"
                        onClick={() => setIsRegistering(true)}
                      >
                        Register now (not advised)
                      </Button>
                    </div>
                  )}
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AdminLogin;
