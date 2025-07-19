import React, { useState, useEffect } from "react";
import axios from "axios";
import { axiosInstance } from "../../axiosInstance";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import "./RegisterForm.scss";
import { useDispatch } from "react-redux";
import { login } from "../../redux/slices/userSlice";

const RESEND_TIME_LIMIT = 120;

const RegisterForm = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userOtp, setOtp] = useState("");
  const [userName, setUserName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [gender, setGender] = useState("male");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateMobileNumber = (number) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(number);
  };

  const validatePassword = (password) => {
    const errors = [];

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long.");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Password must include at least one lowercase letter.");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must include at least one uppercase letter.");
    }
    if (!/\d/.test(password)) {
      errors.push("Password must include at least one number.");
    }
    if (!/[!@#$%^&*]/.test(password)) {
      errors.push(
        "Password must include at least one special character (!@#$%^&*)."
      );
    }
    return errors.length > 0 ? errors : null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const passwordErrors = validatePassword(password);

    if (passwordErrors) {
      setError(passwordErrors.join(" "));
      return;
    } else {
      setError("");
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post(`/auth/register`, {
        email,
        password,
        userType: "customer",
      });
      setLoading(false);
      setIsOtpSent(true);
      setCountdown(RESEND_TIME_LIMIT);

      toast.success(
        `Registration successful: ${response.data.message || "OTP sent!"}`
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error.message || "Registration failed.";
      setError(errorMessage);
      setLoading(false);

      toast.error(`Registration failed: ${errorMessage}`);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post(`/auth/verify-otp`, {
        email,
        password,
        userType: "customer",
        userOtp: userOtp,
      });

      if (response.status === 200 || response.status === 201) {
        try {
          const loginResponse = await axiosInstance.post(`/auth/login`, {
            email,
            password,
          });
          dispatch(
            login({
              user: loginResponse.data.user,
              token: loginResponse.data.token,
              refreshToken: loginResponse.data.refreshToken,
            })
          );

          setIsOtpVerified(true);

          toast.success(
            `OTP verified successfully. Welcome, ${loginResponse.data.user.name}!`
          );
        } catch (error) {
          const errorMessage =
            error.response?.data?.message ||
            "Login failed. Please check your credentials and try again.";
          setError(errorMessage);
          toast.error(errorMessage);
        }
      } else {
        setError("Unexpected response status.");
        toast.error("Unexpected response status.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "OTP verification failed.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDetails = async (e) => {
    e.preventDefault();
    if (!validateMobileNumber(mobileNumber)) {
      setError("Please enter a valid 10-digit mobile number.");
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }
    setLoading(true);
    try {
      const response = await axiosInstance.post(`/user/details`, {
        userName,
        mobileNumber,
        gender,
      });

      if (response.status === 200 || response.status === 201) {
        toast.success("User details added successfully.");
        navigate("/");
      } else {
        setError("Failed to add user details.");
        toast.error("Failed to add user details.");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to add user details.";
      setError(errorMessage);

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.post(`/auth/resend-otp`, {
        email,
        password,
      });
      setLoading(false);
      setCountdown(RESEND_TIME_LIMIT);
      toast.success(response.data.message || "OTP resent successfully.");
    } catch (error) {
      const errorMessage =
        error.response?.data?.error || error.message || "Failed to resend OTP.";
      setError(errorMessage);
      setLoading(false);
      toast.error(errorMessage);
    }
  };

  const handleEditEmail = () => {
    setIsOtpSent(false);
    setIsEditingEmail(true);
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [countdown]);

  if (loading) {
    return <div className="loading-container"></div>;
  }

  return (
    <Container fluid className="register-page">
      <Row className="d-flex align-items-center">
        <Col md={6} className="register-image-col">
          <img
            src="https://storage.googleapis.com/turtleman-primary-bucket/public_images/website_stuff/register_hero_image.webp"
            alt="Fashion"
            className="register-image"
            loading="lazy"
          />
        </Col>
        <Col md={6} className="register-form-col">
          <div className="register-form-wrapper">
            <h2 className="text-center mb-4">
              {isOtpVerified ? "Complete Your Profile" : "Create Your Account"}
            </h2>
            <p className="text-center mb-4">
              {isOtpVerified
                ? "Add your details to complete the registration."
                : "Join us to access exclusive offers and the latest trends."}
            </p>
            {error && (
              <Alert variant="danger">
                <ul>
                  {error.split(". ").map((err, index) => (
                    <li key={index}>{err}</li>
                  ))}
                </ul>
              </Alert>
            )}

            <Form
              onSubmit={
                isOtpVerified
                  ? handleAddDetails
                  : isOtpSent
                  ? verifyOtp
                  : handleRegister
              }
            >
              {!isOtpVerified && (
                <>
                  {isEditingEmail ? (
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Email address</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <Button
                        variant="link"
                        onClick={() => setIsEditingEmail(false)}
                        style={{ padding: 0, marginTop: "0.5rem" }}
                      >
                        Cancel
                      </Button>
                    </Form.Group>
                  ) : (
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Email address</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isOtpSent}
                      />
                      {isOtpSent && (
                        <Button
                          variant="link"
                          onClick={handleEditEmail}
                          style={{ padding: 0, marginTop: "0.5rem" }}
                        >
                          Edit Email
                        </Button>
                      )}
                    </Form.Group>
                  )}

                  <Form.Group className="mb-4" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <div className="password-wrapper">
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isOtpSent}
                      />
                      <i
                        className={`eye-icon ${
                          showPassword ? "eye-open" : "eye-closed"
                        }`}
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    </div>
                  </Form.Group>

                  {isOtpSent && (
                    <Form.Group className="mb-4" controlId="formBasicOtp">
                      <Form.Label>Enter OTP</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter OTP"
                        value={userOtp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                      />
                      <Form.Text className="text-muted">
                        {countdown > 0 ? (
                          `Resend OTP in ${Math.floor(countdown / 60)}:${
                            countdown % 60
                          }`
                        ) : (
                          <Button
                            variant="link"
                            onClick={handleResendOtp}
                            style={{ padding: 0 }}
                          >
                            Resend OTP
                          </Button>
                        )}
                      </Form.Text>
                    </Form.Group>
                  )}
                </>
              )}

              {isOtpVerified && (
                <>
                  <Form.Group className="mb-3" controlId="formUserName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formMobileNumber">
                    <Form.Label>Mobile Number</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your mobile number"
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formGender">
                    <Form.Label>Gender</Form.Label>
                    <Form.Control
                      as="select"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Form.Control>
                  </Form.Group>
                </>
              )}

              <Button
                variant="warning"
                type="submit"
                className="w-100 mb-3 login-button"
              >
                {isOtpVerified
                  ? "Add Details"
                  : isOtpSent
                  ? "Verify OTP"
                  : "Register"}
              </Button>
              <div className="other-links">
                <div className="link-item">
                  <p>Existing user?</p>
                  <Button
                    variant="link"
                    onClick={() => navigate("/auth/login")}
                  >
                    Login now
                  </Button>
                </div>
                <div className="separator"></div>
                <div className="link-item">
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

export default RegisterForm;
