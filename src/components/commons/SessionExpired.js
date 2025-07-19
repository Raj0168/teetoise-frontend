import React from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const SessionExpired = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/auth/login");
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <Row>
        <Col className="text-center">
          <h1>Session Expired</h1>
          <p>Your session has expired. Please log in again.</p>
          <Button onClick={handleLogin} variant="primary">
            Login
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default SessionExpired;
