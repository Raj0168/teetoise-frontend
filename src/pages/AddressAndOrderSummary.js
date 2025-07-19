import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Spinner,
  Alert,
} from "react-bootstrap";
import { axiosInstance } from "../axiosInstance";
import { toast } from "react-toastify";
import axios from "axios";
import { formatIndianCurrency } from "../utils/currencyFormatter";
import "./AddressAndOrderSummary.scss";
import { useNavigate } from "react-router-dom";

const AddressAndOrderSummary = () => {
  const [checkoutDetails, setCheckoutDetails] = useState([]);
  const [totalAmountBeforeCoupon, setTotalAmountBeforeCoupon] = useState(0);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [totalAmountAfterCoupon, setTotalAmountAfterCoupon] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [recipientName, setRecipientName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [cityState, setCityState] = useState({ district: "", state: "" });
  const [newAddress, setNewAddress] = useState({
    address_header: "",
    address: "",
    pin_code: "",
  });
  const [newRecipientName, setNewRecipientName] = useState("");
  const [newMobileNumber, setNewMobileNumber] = useState("");
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [isDifferentRecipient, setIsDifferentRecipient] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addressLoading, SetAddressLoading] = useState(false);
  const [pinError, setPinError] = useState("");
  const [locationInfo, setLocationInfo] = useState({ district: "", state: "" });
  const navigate = useNavigate();

  useEffect(() => {
    fetchCheckoutDetails();
    fetchAddresses();
    fetchUserDetails();
  }, []);

  const fetchCheckoutDetails = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/checkout");
      const data = response.data.checkout;

      setCheckoutDetails(data.items || []);
      setTotalAmountBeforeCoupon(data.totalAmountBeforeCoupon || 0);
      setCouponDiscount(data.couponDiscount || 0);
      setTotalAmountAfterCoupon(data.totalAmountAfterCoupon || 0);
    } catch (error) {
      toast.error("Failed to fetch checkout details.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await axiosInstance.get("/user/address");
      setAddresses(response.data || []);
    } catch (error) {
      toast.error("Failed to fetch addresses.");
    }
  };

  const fetchUserDetails = async () => {
    try {
      const response = await axiosInstance.get("/user/details");
      setRecipientName(response.data.user_name || "");
      setMobileNumber(response.data.mobile_number || "");
    } catch (error) {
      toast.error("Failed to fetch user details.");
    }
  };

  const handleAddressSelection = (id) => {
    setSelectedAddressId(id);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "pin_code") {
      if (/^\d{0,6}$/.test(value)) {
        setNewAddress({ ...newAddress, [name]: value });
        if (value.length === 6) {
          fetchLocationInfo(value);
        } else {
          setPinError("PIN code must be of 6 digits.");
          setLocationInfo({ district: "", state: "" });
        }
      }
    } else {
      setNewAddress({ ...newAddress, [name]: value });
    }
  };

  const fetchLocationInfo = async (pinCode) => {
    try {
      SetAddressLoading(true);
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
      setPinError("Failed to fetch location info.");
    } finally {
      SetAddressLoading(false);
    }
  };

  const handleAddAddress = async () => {
    const addressWithLocation = {
      ...newAddress,
      address: `${newAddress.address}, District: ${locationInfo.district}, State: ${locationInfo.state}`,
    };

    try {
      await axiosInstance.post("/user/address", addressWithLocation);
      fetchAddresses();
      setNewAddress({ address_header: "", address: "", pin_code: "" });
      setLocationInfo({ district: "", state: "" });
      setIsAddingNewAddress(false);
    } catch (error) {
      toast.error("Failed to add address.");
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

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayNow = async () => {
    if (!selectedAddressId) {
      toast.error("Please select address.");
      return;
    }
    if (!recipientName || !mobileNumber) {
      toast.error("Please fill recipient's before proceeding to payment.");
      return;
    }

    const isRazorpayLoaded = await loadRazorpayScript();
    if (!isRazorpayLoaded) {
      toast.error("Razorpay SDK failed to load. Please check your connection.");
      return;
    }

    try {
      const initiateResponse = await axiosInstance.post(
        "/payment/initiate-payment"
      );

      if (!initiateResponse.data.success) {
        throw new Error("Failed to initiate payment.");
      }

      const { order_id, amount, userDetails } = initiateResponse.data;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: "INR",
        name: "Teetoise",
        description: "Teetoise Order Payment",
        image:
          "https://storage.googleapis.com/turtleman-primary-bucket/public_images/website_stuff/TEEEEEEEHEEEE.jpg",
        order_id,
        prefill: {
          name: isDifferentRecipient ? newRecipientName : recipientName,
          email: userDetails.email,
          contact: isDifferentRecipient ? newMobileNumber : mobileNumber,
        },
        notes: {
          address: addresses.find((addr) => addr.id === selectedAddressId)
            .address,
        },
        theme: {
          color: "#000",
        },
        handler: async function (response) {
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            response;

          if (
            !razorpay_order_id ||
            !razorpay_signature ||
            !razorpay_payment_id
          ) {
            throw new Error(
              "Incomplete payment details received from Razorpay"
            );
          }

          try {
            setLoading(true);
            const verificationResponse = await axiosInstance.post(
              "/payment/verify-payment",
              {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                delivery_address: addresses.find(
                  (addr) => addr.id === selectedAddressId
                ).address,
                delivery_pin_code: addresses.find(
                  (addr) => addr.id === selectedAddressId
                ).pin_code,
                receipant_name: isDifferentRecipient
                  ? newRecipientName
                  : recipientName,
                receipant_contact: isDifferentRecipient
                  ? newMobileNumber
                  : mobileNumber,
              }
            );
            toast.success("Payment successful!");
            const { order_id } = verificationResponse.data;
            setLoading(false);
            navigate(`/order-confirmed/${order_id}`);
          } catch (error) {
            console.error("Error during payment verification", error);
            toast.error("Payment verification failed.");
            setLoading(false);
            navigate(`/payment-failed`);
          }
        },
        modal: {
          ondismiss: function () {
            toast.info("Payment canceled.");
          },
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Error initiating payment", error);
      toast.error("Payment initiation failed.");
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-spinner"></div>;
  }

  return (
    <Container className="address-order-summary">
      <Card className="my-3">
        <Card.Body>
          <h2>Recipient Information</h2>
          <Form.Group as={Row}>
            <Form.Label column sm={2}>
              Name:
            </Form.Label>
            <Col sm={10}>
              <Form.Control
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                disabled
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
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
            </Col>
          </Form.Group>

          <Form.Check
            type="checkbox"
            label="Order for someone else?"
            checked={isDifferentRecipient}
            onChange={() => setIsDifferentRecipient(!isDifferentRecipient)}
            className="custom-checkbox"
          />

          {isDifferentRecipient && (
            <>
              <Form.Group as={Row} className="mt-3">
                <Form.Label column sm={2}>
                  Recipient Name:
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="text"
                    value={newRecipientName}
                    onChange={(e) => setNewRecipientName(e.target.value)}
                  />
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="mb-3">
                <Form.Label column sm={2}>
                  Recipient Mobile:
                </Form.Label>
                <Col sm={10}>
                  <Form.Control
                    type="text"
                    value={newMobileNumber}
                    onChange={(e) => setNewMobileNumber(e.target.value)}
                  />
                </Col>
              </Form.Group>
            </>
          )}
        </Card.Body>
      </Card>

      <Card className="address-card my-3">
        <Card.Body>
          <h2>Select Address</h2>
          {addresses.length > 0 ? (
            <ListGroup>
              {addresses.map((address) => (
                <ListGroup.Item
                  key={address.id}
                  className={`address-list-item ${
                    selectedAddressId === address.id ? "selected-address" : ""
                  }`}
                  onClick={() => handleAddressSelection(address.id)}
                >
                  <Form.Check
                    type="radio"
                    id={`address-${address.id}`}
                    name="selectedAddress"
                    label={
                      <>
                        <strong>{address.address_header || "N/A"}</strong>
                        {address.address || "N/A"}, PIN:{" "}
                        {address.pin_code || "N/A"}
                      </>
                    }
                    value={address.id}
                    checked={selectedAddressId === address.id}
                    onChange={() => handleAddressSelection(address.id)}
                  />
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <Alert variant="warning">
              No addresses found. Please add an address below.
            </Alert>
          )}
          <Button
            variant="primary"
            className="mt-2"
            onClick={() => setIsAddingNewAddress(true)}
          >
            Add New Address
          </Button>
          {isAddingNewAddress && (
            <div className="mt-3 address-form">
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
                    PIN Code:
                  </Form.Label>
                  <Col sm={10}>
                    <Form.Control
                      type="text"
                      name="pin_code"
                      value={newAddress.pin_code}
                      onChange={handleChange}
                      placeholder="Enter PIN code"
                      maxLength="6"
                    />
                    {addressLoading && (
                      <div className="spinner-container">
                        <Spinner animation="border" size="sm" />
                        <span className="ms-2">Fetching city and state...</span>
                      </div>
                    )}
                    {locationInfo.district && locationInfo.state && (
                      <Form.Text className="text-success">
                        <strong>City:</strong> {locationInfo.district} <br />
                        <strong>State:</strong> {locationInfo.state}
                      </Form.Text>
                    )}
                    {pinError && (
                      <Form.Text className="text-danger">{pinError}</Form.Text>
                    )}
                  </Col>
                </Form.Group>
                <Button
                  variant="success"
                  onClick={handleAddAddress}
                  disabled={!isFormValid()}
                >
                  Add Address
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setIsAddingNewAddress(false)}
                >
                  Cancel
                </Button>
              </Form>
            </div>
          )}
        </Card.Body>
      </Card>

      <h2>Order Summary</h2>
      <Card className="my-3">
        <Card.Body>
          {checkoutDetails && checkoutDetails.length > 0 ? (
            <>
              <ListGroup>
                {checkoutDetails.map((item) => (
                  <ListGroup.Item
                    key={item.productId + item.productSize}
                    className="order-summary-item"
                  >
                    <Row>
                      <Col xs={12} md={4}>
                        <img
                          src={item.photos}
                          alt={item.productId}
                          className="img-fluid"
                        />
                      </Col>
                      <Col xs={12} md={8} className="item-details">
                        <div>
                          <strong>Product:</strong> {item.productId || "N/A"}
                        </div>
                        <div>
                          <strong>Size:</strong> {item.productSize || "N/A"}
                        </div>
                        <div>
                          <strong>Quantity:</strong> {item.productQuantity || 0}
                        </div>
                        <div className="text-end">
                          <strong>Price:</strong>{" "}
                          {formatIndianCurrency(item.productPrice) || "0.00"}
                        </div>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <div className="summary">
                <div>
                  <strong>Total Amount Before Coupon:</strong>&nbsp;&nbsp;
                  {formatIndianCurrency(totalAmountBeforeCoupon)}
                </div>
                <div>
                  <strong>Coupon Discount:</strong> &nbsp;&nbsp;
                  {formatIndianCurrency(couponDiscount)}
                </div>
                <div>
                  <strong>Total Amount After Coupon:</strong>&nbsp;&nbsp;
                  {formatIndianCurrency(totalAmountAfterCoupon)}
                </div>
              </div>
            </>
          ) : (
            <Alert variant="warning">No checkout details available.</Alert>
          )}
        </Card.Body>
      </Card>

      <Button variant="warning" className="w-100 mb-3" onClick={handlePayNow}>
        Pay {formatIndianCurrency(totalAmountAfterCoupon)}
      </Button>
    </Container>
  );
};

export default AddressAndOrderSummary;
