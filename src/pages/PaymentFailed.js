import React from "react";
import { Container, Row, Col, Alert, Button } from "react-bootstrap";
import { FaTimesCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./PaymentFailedPage.scss"; // For additional custom styles

const PaymentFailedPage = () => {
  return (
    <Container className="payment-failed-container">
      <Alert variant="danger" className="text-center mt-5">
        <FaTimesCircle size={32} className="me-2" />
        Payment Failed! Unfortunately, we were unable to process your payment.
      </Alert>

      <Row className="justify-content-center">
        <Col xs={12} md={8} className="text-center">
          <p>
            If any amount was debited from your account, it will be refunded
            within 3-5 business days. If you have any queries, feel free to contact us.
          </p>

          <Button className="mt-2" variant="warning" as={Link} to="/cart">
            Try Again
          </Button>
        </Col>
      </Row>

      <Row className="justify-content-center mt-4">
        <Col xs={12} md={8} className="text-center">
          <Alert variant="info">
            You can review your cart and attempt the payment again by clicking
            the button above.
          </Alert>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentFailedPage;
