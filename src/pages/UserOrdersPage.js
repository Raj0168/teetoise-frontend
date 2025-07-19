import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { FaTshirt, FaTag, FaRuler, FaInfoCircle } from "react-icons/fa";
import { axiosInstance } from "../axiosInstance";
import { useNavigate } from "react-router-dom";
import "./UserOrdersPage.scss";

const UserOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/orders/users-orders/");
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleOrderClick = (order) => {
    navigate("/order-details", { state: { order } });
  };

  if (loading) {
    return <div className="loading-container"></div>;
  }

  return (
    <div className="container user-orders-page">
      <h5>My Orders</h5>
      <Row className="cards-section">
        {orders.map((order) => {
          const status =
            order.is_cancelled || order.is_exchanged || order.is_returned
              ? order.product_status
              : order.order_status;

          return (
            <Col key={order.detail_id} xs={12} md={6} lg={6}>
              <Card
                className="order-card"
                onClick={() => handleOrderClick(order)}
              >
                <Row className="row g-0">
                  <Col xs={4}>
                    <Card.Img
                      variant="top"
                      src={order.product_image}
                      alt={order.product_name}
                      className="product-image"
                    />
                  </Col>
                  <Col xs={8} xl={8} className="d-flex align-items-center">
                    <Card.Body>
                      <Card.Title className="product-title">
                        {order.product_title}
                      </Card.Title>
                      <Card.Text>
                        <FaTag className="icon" /> Price: ₹{order.product_price}
                      </Card.Text>
                      <Card.Text>
                        <FaRuler className="icon" /> Size: {order.product_size}
                      </Card.Text>
                      <Card.Text>
                        <FaInfoCircle className="icon" /> Status:{" "}
                        {status?.toUpperCase()}
                      </Card.Text>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default UserOrdersPage;
