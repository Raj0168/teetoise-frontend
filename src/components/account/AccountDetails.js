import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Alert,
  Spinner,
} from "react-bootstrap";
import { axiosInstance } from "../../axiosInstance";
import "./accountStyle.scss";

const AccountDetails = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosInstance.get("/user/details");
        setUserDetails(response.data || {});
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleSave = async () => {
    try {
      await axiosInstance.post("/user/details", {
        userName: userDetails.user_name,
        mobileNumber: userDetails.mobile_number,
        gender: userDetails.gender,
      });
      setIsEditMode(false);
    } catch (error) {
      console.error("Failed to save user details:", error);
    }
  };

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  return (
    <Container>
      <Card className="my-3 p-3">
        <Card.Title>Account Details</Card.Title>
        {loading ? (
          <div className="d-flex justify-content-center my-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : userDetails ? (
          <Form>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>
                Name:
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="text"
                  name="user_name"
                  value={userDetails.user_name || ""}
                  onChange={handleChange}
                  readOnly={!isEditMode}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>
                Mobile:
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  type="text"
                  name="mobile_number"
                  value={userDetails.mobile_number || ""}
                  onChange={handleChange}
                  readOnly={!isEditMode}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={2}>
                Gender:
              </Form.Label>
              <Col sm={10}>
                <Form.Control
                  as="select"
                  name="gender"
                  value={userDetails.gender || ""}
                  onChange={handleChange}
                  disabled={!isEditMode}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="others">Others</option>
                </Form.Control>
              </Col>
            </Form.Group>
            <button
              type="button"
              className="button-primary"
              onClick={isEditMode ? handleSave : handleEdit}
            >
              {isEditMode ? "Save" : "Edit"}
            </button>
          </Form>
        ) : (
          <Alert variant="warning">
            No account details found. Please{" "}
            <button type="button" onClick={handleEdit}>
              add your details
            </button>
            .
          </Alert>
        )}
      </Card>
    </Container>
  );
};

export default AccountDetails;
