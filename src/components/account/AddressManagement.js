import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Alert,
} from "react-bootstrap";
import { axiosInstance } from "../../axiosInstance";
import "./accountStyle.scss";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";

const AddressManagement = () => {
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    address_header: "",
    address: "",
    pin_code: "",
  });
  const [pinError, setPinError] = useState("");
  const [loading, setLoading] = useState(false);
  const [locationInfo, setLocationInfo] = useState({ district: "", state: "" });

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axiosInstance.get("/user/address");
        setAddresses(response.data || []);
      } catch (error) {
        console.error("Failed to fetch addresses:", error);
      }
    };

    fetchAddresses();
  }, []);

  const fetchLocationInfo = async (pinCode) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.postalpincode.in/pincode/${pinCode}`
      );
      const data = response.data[0];
      if (data.Status === "Success" && data.PostOffice.length > 0) {
        const { District, State } = data.PostOffice[0];
        setLocationInfo({ district: District, state: State });
        setPinError("");
      } else {
        setLocationInfo({ district: "", state: "" });
        setPinError("PIN code is not valid, please enter a valid PIN code.");
      }
    } catch (error) {
      console.error("Failed to fetch location info:", error);
      setPinError("Failed to fetch location info.");
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "pin_code") {
      if (/^\d{0,6}$/.test(value)) {
        setNewAddress({ ...newAddress, [name]: value });
        if (value.length === 6) {
          fetchLocationInfo(value);
        } else {
          setPinError("PIN code must be exactly 6 digits.");
          setLocationInfo({ district: "", state: "" });
        }
      }
    } else {
      setNewAddress({ ...newAddress, [name]: value });
    }
  };

  const handleAddAddress = async () => {
    const addressWithLocation = {
      ...newAddress,
      address: `${newAddress.address}, District: ${locationInfo.district}, State: ${locationInfo.state}`,
    };

    try {
      await axiosInstance.post("/user/address", addressWithLocation);

      const fetchAddresses = async () => {
        try {
          const response = await axiosInstance.get("/user/address");
          setAddresses(response.data || []);
        } catch (error) {
          console.error("Failed to fetch addresses:", error);
        }
      };

      fetchAddresses();

      setNewAddress({ address_header: "", address: "", pin_code: "" });
      setLocationInfo({ district: "", state: "" });
    } catch (error) {
      console.error("Failed to add address:", error);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await axiosInstance.delete(`/user/address/${id}`);
      setAddresses(addresses.filter((address) => address.id !== id));
    } catch (error) {
      console.error("Failed to delete address:", error);
    }
  };

  const isFormValid = () => {
    return (
      newAddress.address_header.trim() !== "" &&
      newAddress.address.trim() !== "" &&
      newAddress.pin_code.trim().length === 6 &&
      !pinError
    );
  };

  return (
    <Container>
      <Card className="my-3 p-3">
        <Card.Title>Manage Addresses</Card.Title>
        {addresses.length > 0 ? (
          addresses.map((address, index) => (
            <Row key={address.id || index} className="mb-3">
              <Col>
                <strong>{address.address_header}</strong>
                <p>
                  {address.address}, PIN: {address.pin_code}
                </p>
              </Col>
              <Col xs="auto">
                <button
                  type="button"
                  className="remove-button"
                  onClick={() => handleDeleteAddress(address.id)}
                >
                  Delete
                </button>
              </Col>
            </Row>
          ))
        ) : (
          <Alert variant="warning">
            No addresses found. Please add your first address below.
          </Alert>
        )}
        <Form>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={2}>
              Address Type:
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="text"
                name="address_header"
                value={newAddress.address_header}
                onChange={handleChange}
                placeholder="e.g., Home, Office"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={2}>
              Address:
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="text"
                name="address"
                value={newAddress.address}
                onChange={handleChange}
                placeholder="Enter your address"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={2}>
              PIN:
            </Form.Label>
            <Col sm={10} className="position-relative">
              <Form.Control
                type="text"
                name="pin_code"
                value={newAddress.pin_code}
                onChange={handleChange}
                placeholder="Enter PIN code"
                isInvalid={!!pinError}
              />
              {loading && (
                <div
                  className="position-absolute"
                  style={{
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  <Spinner animation="border" size="sm" />
                </div>
              )}
              <Form.Control.Feedback type="invalid">
                {pinError}
              </Form.Control.Feedback>
              {locationInfo.district && locationInfo.state && (
                <Form.Text className="text-muted mt-2">
                  <strong>District:</strong> {locationInfo.district} <br />
                  <strong>State:</strong> {locationInfo.state}
                </Form.Text>
              )}
            </Col>
          </Form.Group>
          <button
            type="button"
            onClick={handleAddAddress}
            disabled={!isFormValid()}
            className="button-primary"
          >
            Add Address
          </button>
        </Form>
      </Card>
    </Container>
  );
};

export default AddressManagement;
