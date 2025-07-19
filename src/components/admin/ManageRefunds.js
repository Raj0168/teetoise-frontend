import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Spinner, Form } from "react-bootstrap";
import { axiosInstance } from "../../axiosInstance";

const ManageRefunds = () => {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [declineMessage, setDeclineMessage] = useState(""); // State for decline message

  useEffect(() => {
    // Fetch refunds from the backend
    const fetchRefunds = async () => {
      try {
        const response = await axiosInstance.get(
          `/orders/all-refunds`
        );
        setRefunds(response.data);
      } catch (error) {
        console.error("Error fetching refunds:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRefunds();
  }, []);

  const handleViewRefund = async (refundId) => {
    try {
      const response = await axiosInstance.get(
        `/orders/refunds/${refundId}`
      );
      setSelectedRefund(response.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching refund details:", error);
    }
  };

  const handleRefund = async (refundId) => {
    try {
      await axiosInstance.put(
        `/orders/refunds/${refundId}/refund`
      );
      alert("Refund status updated to 'refunded'");
      setShowModal(false); // Close modal after action
    } catch (error) {
      console.error("Error updating refund:", error);
      alert("Failed to update refund");
    }
  };

  const handleAcceptRefund = async (refundId) => {
    try {
      await axiosInstance.put(
        `/orders/refunds/${refundId}/accept-refund`
      );
      alert("Refund status updated to 'refunded'");
      setShowModal(false);
    } catch (error) {
      console.error("Error updating refund:", error);
      alert("Failed to update refund");
    }
  };

  const handleDeclineRefund = async (refundId) => {
    try {
      await axiosInstance.put(
        `/orders/refunds/${refundId}/decline`,
        { decline_message: declineMessage }
      );
      alert("Refund declined");
      setShowModal(false); // Close modal after action
    } catch (error) {
      console.error("Error declining refund:", error);
      alert("Failed to decline refund");
    }
  };

  return (
    <div>
      <h2>Manage Refunds</h2>
      {loading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Refund ID</th>
              <th>Order ID</th>
              <th>Status</th>
              <th>Refund Amount</th>
              <th>Payment Method</th>
              <th>Refund Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {refunds.map((refund) => (
              <tr key={refund.refund_id}>
                <td>{refund.refund_id}</td>
                <td>{refund.original_order_id}</td>
                <td>{refund.refund_status}</td>
                <td>{refund.refund_amount}</td>
                <td>{refund.payment_method}</td>
                <td>{new Date(refund.refund_date).toLocaleDateString()}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleViewRefund(refund.refund_id)}
                  >
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal for viewing refund details */}
      {selectedRefund && (
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Refund Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              <strong>Refund Reason:</strong>{" "}
              {selectedRefund.refund.refund_reason}
            </p>
            <p>
              <strong>Refund Status:</strong>{" "}
              {selectedRefund.refund.refund_status}
            </p>
            <p>
              <strong>Refund Amount:</strong>{" "}
              {selectedRefund.refund.refund_amount}
            </p>
            <p>
              <strong>Payment Method:</strong>{" "}
              {selectedRefund.refund.payment_method}
            </p>
            <p>
              <strong>Refund Date:</strong>{" "}
              {new Date(selectedRefund.refund.refund_date).toLocaleDateString()}
            </p>
            <p>
              <strong>Refund Message:</strong>{" "}
              {selectedRefund.refund.return_message}
            </p>

            <h4>User Details</h4>
            <p>
              <strong>User Name:</strong>{" "}
              {selectedRefund.user.user_name || "N/A"}
            </p>
            <p>
              <strong>User Email:</strong> {selectedRefund.user.email}
            </p>
            <p>
              <strong>User Mobile:</strong>{" "}
              {selectedRefund.user.mobile_number || "N/A"}
            </p>

            <h4>Payment Details</h4>
            <p>
              <strong>Payment Mode:</strong>{" "}
              {selectedRefund.paymentDetails.payment_mode || "N/A"}
            </p>
            <p>
              <strong>Payment Order ID:</strong>{" "}
              {selectedRefund.paymentDetails.razorpay_order_id || "N/A"}
            </p>
            <p>
              <strong>Payment Payment ID:</strong>{" "}
              {selectedRefund.paymentDetails.razorpay_payment_id || "N/A"}
            </p>
            <p>
              <strong>Payment Date:</strong>{" "}
              {selectedRefund.paymentDetails.created_at || "N/A"}
            </p>

            <h5>Product Details</h5>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Product Image</th>
                  <th>Product Name</th>
                  <th>Size</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {selectedRefund.products.map((product) => (
                  <tr key={product.product_id}>
                    <td>
                      <img
                        src={product.product_image}
                        alt={product.product_title}
                        style={{ height: "50px", objectFit: "contain" }}
                      />
                    </td>
                    <td>{product.product_title}</td>
                    <td>{product.product_size}</td>
                    <td>{product.product_quantity}</td>
                    <td>${product.product_price}</td>
                    <td>{product.product_status}</td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Form.Group controlId="declineMessage">
              <Form.Label>Decline Message (optional):</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter decline message"
                value={declineMessage}
                onChange={(e) => setDeclineMessage(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="success"
              onClick={() =>
                handleAcceptRefund(selectedRefund.refund.refund_id)
              }
            >
              Accept Refund
            </Button>
            <Button
              variant="success"
              onClick={() => handleRefund(selectedRefund.refund.refund_id)}
            >
              Mark as Refunded
            </Button>
            <Button
              variant="danger"
              onClick={() =>
                handleDeclineRefund(selectedRefund.refund.refund_id)
              }
            >
              Decline Refund
            </Button>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default ManageRefunds;
