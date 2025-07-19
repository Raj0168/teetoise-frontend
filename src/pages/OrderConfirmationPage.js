import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Alert,
  Table,
  Spinner,
  Image,
} from "react-bootstrap";
import { FaCheckCircle } from "react-icons/fa";
import { axiosInstance } from "../axiosInstance";
import "./OrderConfirmationPage.scss"; // For additional custom styles

const OrderConfirmationPage = () => {
  const { order_id } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        if (!order_id) throw new Error("Order ID not provided");

        const response = await axiosInstance.get(
          `/orders/confirmed-order/${order_id}`
        );
        setOrderDetails(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message || "Failed to fetch order details.");
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [order_id]);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="text-center mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="order-confirmed-container">
      <Alert variant="success" className="text-center mt-3">
        <FaCheckCircle size={32} className="me-2" />
        Order Confirmed! You will receive shipping and delivery details via
        email.
      </Alert>

      <Row className="justify-content-center">
        <Col xs={12} md={8}>
          <h4 className="text-center my-4">Order Details</h4>

          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails?.order_items?.map((item) => (
                <tr key={item.product_id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <Image
                        src={item.product_image}
                        alt={item.product_name}
                        rounded
                        style={{ width: "50px", marginRight: "10px" }}
                      />
                      {item.product_title} ({item.product_size})
                    </div>
                  </td>
                  <td>{item.product_quantity}</td>
                  <td>₹{item.product_price}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="2">
                  <strong>Order ID</strong>
                </td>
                <td>{orderDetails?.public_order_id}</td>
              </tr>
              <tr>
                <td colSpan="2">
                  <strong>Coupon Discount</strong>
                </td>
                <td>₹{orderDetails?.coupon_discount || "0.00"}</td>
              </tr>
              <tr>
                <td colSpan="2">
                  <strong>Total Amount</strong>
                </td>
                <td>₹{orderDetails?.amount || "N/A"}</td>
              </tr>

              <tr>
                <td colSpan="2">
                  <strong>Order Status</strong>
                </td>
                <td>{orderDetails?.order_status || "N/A"}</td>
              </tr>
              <tr>
                <td colSpan="2">
                  <strong>Estimated Delivery By</strong>
                </td>
                <td>
                  {orderDetails?.estimate_delivery
                    ? new Date(
                        orderDetails.estimate_delivery
                      ).toLocaleDateString()
                    : "N/A"}
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <strong>Delivery Address</strong>
                </td>
                <td>{orderDetails?.delivery_address || "N/A"}</td>
              </tr>
              <tr>
                <td colSpan="2">
                  <strong>Receipant Name</strong>
                </td>
                <td>{orderDetails?.receipant_name || "N/A"}</td>
              </tr>
              <tr>
                <td colSpan="2">
                  <strong>Receipant Contact</strong>
                </td>
                <td>{orderDetails?.receipant_contact || "N/A"}</td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>

      <Row className="justify-content-center mt-4">
        <Col xs={12} md={8} className="text-center">
          <Alert variant="info">
            You can check your order status in the "My Orders" section of your
            account.
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderConfirmationPage;
