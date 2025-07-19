import React, { useEffect, useState } from "react";
import { Card, Button, Modal, Form, Table } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../axiosInstance";
import {
  FaTrashAlt,
  FaExchangeAlt,
  FaUndoAlt,
  FaEnvelope,
  FaWhatsapp,
} from "react-icons/fa";
import "./OrderDetailsPage.scss";
import { toast } from "react-toastify";
import { formatIndianCurrency } from "../utils/currencyFormatter";

const OrderDetailsPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [refundDetails, setRefundDetails] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("Quality issues");
  const [customCancelReason, setCustomCancelReason] = useState("");
  const [exchangeSize, setExchangeSize] = useState("S");
  const [exchangeReason, setExchangeReason] = useState("Quality issues");
  const [customExchangeReason, setCustomExchangeReason] = useState("");
  const [returnReason, setReturnReason] = useState("Quality issues");
  const [customReturnReason, setCustomReturnReason] = useState("");
  const [returnDetails, setReturnDetails] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axiosInstance.get(
          `/orders/order-by-id/${state.order.order_id}/${state.order.detail_id}`
        );
        setOrderDetails(response.data);

        // Check if return details need to be fetched
        if (
          response.data.product_status === "return-requested" ||
          response.data.is_returned
        ) {
          await fetchReturnDetails(response.data.detail_id);
        } else if (response.data.is_cancelled || response.data.is_returned) {
          await fetchRefundDetails(response.data.detail_id);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    const fetchReturnDetails = async (detail_id) => {
      try {
        const response = await axiosInstance.get(
          `/orders/returns/detailsByDetailId/${detail_id}`
        );
        setReturnDetails(response.data);
      } catch (error) {
        console.error("Error fetching return details:", error);
      }
    };

    const fetchRefundDetails = async (detail_id) => {
      try {
        const response = await axiosInstance.get(
          `/orders/refund-details/${detail_id}`
        );
        setRefundDetails(response.data);
      } catch (error) {
        console.error("Error fetching refund details:", error);
      }
    };

    fetchOrderDetails();
  }, [state]);

  const handleCancel = async () => {
    try {
      const reason =
        cancelReason === "Others" ? customCancelReason : cancelReason;
      await axiosInstance.post(
        `/refund/orders/${state.order.order_id}/details/${state.order.detail_id}/cancel`,
        { cancelReason: reason }
      );
      toast.info("Order canceled!");
      navigate("/orders");
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error(
        "Error while cancelling order, please try again or contact us"
      );
    }
  };

  const handleReturn = async () => {
    try {
      const reason =
        returnReason === "Others" ? customReturnReason : returnReason;
      await axiosInstance.post(
        `/refund/orders/${state.order.order_id}/details/${state.order.detail_id}/return`,
        { returnReason: reason }
      );
      toast.info("Order return placed");
      navigate("/orders");
    } catch (error) {
      console.error("Error returning order:", error);
      toast.error("Error in returning order, please try again or contact us.");
    }
  };

  const handleExchange = async () => {
    if (exchangeSize === orderDetails.product_size) {
      alert("The new size must be different from the ordered size.");
      return;
    }

    try {
      const reason =
        exchangeReason === "Others" ? customExchangeReason : exchangeReason;
      await axiosInstance.post(
        `/refund/orders/${state.order.order_id}/details/${state.order.detail_id}/exchange`,
        { size: exchangeSize, exchangeReason: "Size issues" }
      );
      alert("Exchange request submitted");
      navigate("/orders");
    } catch (error) {
      console.error("Error exchanging order:", error);
    }
  };

  if (!orderDetails) return <div className="loading-spinner"></div>;

  const orderStatus = orderDetails?.is_cancelled
    ? "CANCELLED"
    : orderDetails?.is_returned
    ? "RETURNED"
    : orderDetails?.is_exchanged
    ? "EXCHANGED"
    : orderDetails?.order_status.toUpperCase();

  return (
    <div className="container order-details-page">
      <div className="product-overview">
        <div className="product-image-container">
          <Link to={`/product/${orderDetails?.product_name}`}>
            <Card.Img
              variant="top"
              src={orderDetails.product_image}
              className="product-image-order"
            />
          </Link>
        </div>
        <div className="product-details">
          <Table striped bordered hover responsive>
            <tbody style={{ fontSize: "14px" }}>
              <tr>
                <td>
                  <strong>Product Name</strong>
                </td>
                <td className="clamped-text">{orderDetails.product_title}</td>
              </tr>
              <tr>
                <td>
                  <strong>Price</strong>
                </td>
                <td>{formatIndianCurrency(orderDetails?.product_price)}</td>
              </tr>
              <tr>
                <td>
                  <strong>Status</strong>
                </td>
                <td>{orderStatus}</td>
              </tr>
              <tr>
                <td>
                  <strong>Size</strong>
                </td>
                <td>{orderDetails.product_size}</td>
              </tr>
              <tr>
                <td>
                  <strong>Quantity</strong>
                </td>
                <td>{orderDetails.product_quantity}</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>

      {(orderDetails.is_cancelled || orderDetails.is_returned) &&
        refundDetails && (
          <div className="refund-details mt-4">
            <h5>Refund Details</h5>
            <Table striped bordered hover responsive>
              <tbody>
                <tr>
                  <td>
                    <strong>Refund Status</strong>
                  </td>
                  <td>{refundDetails?.refund_status?.toUpperCase()}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Refund Amount</strong>
                  </td>
                  <td>{formatIndianCurrency(refundDetails?.refund_amount)}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Payment Method</strong>
                  </td>
                  <td>{refundDetails?.payment_method}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Refund Date</strong>
                  </td>
                  <td>
                    {new Date(refundDetails?.refund_date).toLocaleDateString()}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Reason</strong>
                  </td>
                  <td>{refundDetails?.refund_reason}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Refund Message</strong>
                  </td>
                  <td>{refundDetails?.return_message}</td>
                </tr>
              </tbody>
            </Table>
          </div>
        )}

      {orderDetails?.product_tracking_link &&
        orderDetails?.product_tracking_id && (
          <div>
            <div>Tracking ID: {orderDetails?.product_tracking_id}</div>
            <div>
              Tracking Link:{" "}
              <a href={orderDetails?.product_tracking_link}>
                Shipcorrect tracking link
              </a>
            </div>
          </div>
        )}

      <div className="order-actions">
        <button
          type="button"
          variant="danger"
          onClick={() => setShowCancelModal(true)}
          disabled={
            orderDetails.product_status !== "confirmed" ||
            orderDetails.is_cancelled
          }
        >
          Cancel Order <FaTrashAlt />
        </button>
        <button
          type="button"
          variant="warning"
          onClick={() => setShowReturnModal(true)}
          disabled={
            orderDetails.product_status !== "delivered" ||
            orderDetails.is_returned
          }
        >
          Return Order <FaUndoAlt />
        </button>
        <button
          type="button"
          variant="info"
          onClick={() => setShowExchangeModal(true)}
          disabled={
            orderDetails.product_status !== "delivered" ||
            orderDetails.is_exchanged ||
            orderDetails.product_status === "return-requested"
          }
        >
          Exchange Order <FaExchangeAlt />
        </button>
      </div>

      <div className="order-details-section">
        <h5>Order Information</h5>
        <Table striped bordered hover responsive>
          <tbody>
            <tr>
              <td>
                <strong>Recipient Name</strong>
              </td>
              <td>{orderDetails.receipant_name}</td>
            </tr>
            <tr>
              <td>
                <strong>Contact</strong>
              </td>
              <td>{orderDetails.receipant_contact}</td>
            </tr>
            <tr>
              <td>
                <strong>Delivery Address</strong>
              </td>
              <td>{orderDetails.delivery_address}</td>
            </tr>
            <tr>
              <td>
                <strong>Order Date</strong>
              </td>
              <td>
                {new Date(orderDetails?.created_at).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </td>
            </tr>
            <tr>
              <td>
                <strong>Estimated Delivery</strong>
              </td>
              <td>
                {new Date(orderDetails.estimate_delivery).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }
                )}
              </td>
            </tr>
            <tr>
              <td>
                <strong>Total Amount Paid</strong>
              </td>
              <td>{formatIndianCurrency(orderDetails?.amount)}</td>
            </tr>
            {orderDetails?.coupon_discount &&
              orderDetails?.coupon_discount !== "0.00" && (
                <tr>
                  <td>
                    <strong>Coupon Discount</strong>
                  </td>
                  <td>{formatIndianCurrency(orderDetails.coupon_discount)}</td>
                </tr>
              )}
          </tbody>
        </Table>
      </div>

      {orderDetails.is_returned && returnDetails && (
        <div className="return-details">
          <h5>Return Details</h5>
          <Table striped bordered hover responsive>
            <tbody>
              <tr>
                <td>
                  <strong>Return Status</strong>
                </td>
                <td>{returnDetails.returnDetails.return_status}</td>
              </tr>
              <tr>
                <td>
                  <strong>Return Reason</strong>
                </td>
                <td>{returnDetails.returnDetails.return_reason}</td>
              </tr>
              <tr>
                <td>
                  <strong>Return Date</strong>
                </td>
                <td>
                  {new Date(
                    returnDetails.returnDetails.return_date
                  ).toLocaleString()}
                </td>
              </tr>
              <tr>
                <td>
                  <strong>Product Name</strong>
                </td>
                <td>{returnDetails.productDetails.product_name}</td>
              </tr>
              <tr>
                <td>
                  <strong>Product Size</strong>
                </td>
                <td>{returnDetails.productDetails.product_size}</td>
              </tr>
              <tr>
                <td>
                  <strong>Price</strong>
                </td>
                <td>
                  {formatIndianCurrency(
                    returnDetails?.productDetails?.product_price
                  )}
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      )}

      <div className="help-support">
        <h5>For any help or assistance</h5>
        <p>
          <FaEnvelope /> Email us at:{" "}
          <a href="mailto:teetoise@gmail.com">teetoise@gmail.com</a>
        </p>
        <p>
          <FaWhatsapp /> WhatsApp us at:{" "}
          <a href="https://wa.me/9266112217">+91 9266112217</a>
        </p>
      </div>

      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cancel Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formCancelReason">
              <Form.Label>Reason for Cancellation</Form.Label>
              <Form.Control
                as="select"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              >
                <option>Quality issues</option>
                <option>Size issues</option>
                <option>Others</option>
              </Form.Control>
              {cancelReason === "Others" && (
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter your custom reason"
                  value={customCancelReason}
                  onChange={(e) => setCustomCancelReason(e.target.value)}
                  className="mt-2"
                />
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            Close
          </Button>
          <Button variant="danger" onClick={handleCancel}>
            Cancel Order
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Return Modal */}
      <Modal show={showReturnModal} onHide={() => setShowReturnModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Return Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formReturnReason">
              <Form.Label>Reason for Return</Form.Label>
              <Form.Control
                as="select"
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
              >
                <option>Quality issues</option>
                <option>Size issues</option>
                <option>Others</option>
              </Form.Control>
              {returnReason === "Others" && (
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter your custom reason"
                  value={customReturnReason}
                  onChange={(e) => setCustomReturnReason(e.target.value)}
                  className="mt-2"
                />
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReturnModal(false)}>
            Close
          </Button>
          <Button variant="warning" onClick={handleReturn}>
            Return Order
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Exchange Modal */}
      <Modal
        show={showExchangeModal}
        onHide={() => setShowExchangeModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Exchange Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formExchangeSize">
              <Form.Label>Select New Size</Form.Label>
              <Form.Control
                as="select"
                value={exchangeSize}
                onChange={(e) => setExchangeSize(e.target.value)}
              >
                <option>S</option>
                <option>M</option>
                <option>L</option>
                <option>XL</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formExchangeReason" className="mt-3">
              <Form.Label>Reason for Exchange</Form.Label>
              <Form.Control
                as="select"
                value={exchangeReason}
                onChange={(e) => setExchangeReason(e.target.value)}
              >
                <option>Quality issues</option>
                <option>Size issues</option>
                <option>Others</option>
              </Form.Control>
              {exchangeReason === "Others" && (
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter your custom reason"
                  value={customExchangeReason}
                  onChange={(e) => setCustomExchangeReason(e.target.value)}
                  className="mt-2"
                />
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowExchangeModal(false)}
          >
            Close
          </Button>
          <Button variant="info" onClick={handleExchange}>
            Exchange Order
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrderDetailsPage;
