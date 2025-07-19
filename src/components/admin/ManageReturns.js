import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Spinner, Form } from "react-bootstrap";
import { axiosInstance } from "../../axiosInstance";

const ManageReturns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch all return requests
  useEffect(() => {
    const fetchReturns = async () => {
      try {
        const response = await axiosInstance.get("/orders/return-orders");
        setReturns(response.data);
      } catch (error) {
        console.error("Error fetching returns:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReturns();
  }, []);

  // Fetch details of a specific return request
  const handleViewReturn = async (detailId, returnId) => {
    try {
      const response = await axiosInstance.get(
        `/orders/returns/details/${detailId}/${returnId}`
      );
      setSelectedReturn(response.data);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching return details:", error);
    }
  };

  // Approve return request
  const handleApproveReturn = async (returnId) => {
    try {
      await axiosInstance.put(`/orders/returns/${returnId}/approve`);
      alert("Return request approved");
      setShowModal(false);
    } catch (error) {
      console.error("Error approving return:", error);
      alert("Failed to approve return");
    }
  };

  // Process return request
  const handleProcessReturn = async (returnId) => {
    try {
      await axiosInstance.put(`/orders/returns/${returnId}/process`);
      alert("Return request processed");
      setShowModal(false);
    } catch (error) {
      console.error("Error processing return:", error);
      alert("Failed to process return");
    }
  };

  // Reject return request
  const handleRejectReturn = async (returnId) => {
    try {
      await axiosInstance.put(`/orders/returns/${returnId}/reject`);
      alert("Return request rejected");
      setShowModal(false);
    } catch (error) {
      console.error("Error rejecting return:", error);
      alert("Failed to reject return");
    }
  };

  return (
    <div>
      <h2>Manage Returns</h2>
      {loading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Return ID</th>
              <th>Order ID</th>
              <th>Return Status</th>
              <th>Return Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {returns.map((returnOrder) => (
              <tr key={returnOrder.return_id}>
                <td>{returnOrder.return_id}</td>
                <td>{returnOrder.original_order_id}</td>
                <td>{returnOrder.return_status}</td>
                <td>
                  {new Date(returnOrder.return_date).toLocaleDateString()}
                </td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() =>
                      handleViewReturn(
                        returnOrder.detail_id,
                        returnOrder.return_id
                      )
                    }
                  >
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal for viewing return details */}
      {selectedReturn && (
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Return Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              <strong>Return Reason:</strong>{" "}
              {selectedReturn.returnDetails.return_reason}
            </p>
            <p>
              <strong>Return Status:</strong>{" "}
              {selectedReturn.returnDetails.return_status}
            </p>
            <p>
              <strong>Return Date:</strong>{" "}
              {new Date(
                selectedReturn.returnDetails.return_date
              ).toLocaleDateString()}
            </p>

            <h4>Order Details</h4>
            <p>
              <strong>Recipient Name:</strong>{" "}
              {selectedReturn.orderDetails.receipant_name}
            </p>
            <p>
              <strong>Recipient Contact:</strong>{" "}
              {selectedReturn.orderDetails.receipant_contact}
            </p>
            <p>
              <strong>Delivery Address:</strong>{" "}
              {selectedReturn.orderDetails.delivery_address}
            </p>
            <p>
              <strong>Delivery Pin Code:</strong>{" "}
              {selectedReturn.orderDetails.delivery_pin_code}
            </p>
            <p>
              <strong>Razorpay Order ID:</strong>{" "}
              {selectedReturn.orderDetails.razorpay_order_id}
            </p>

            <h5>Product Details</h5>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Size</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{selectedReturn.productDetails.product_name}</td>
                  <td>{selectedReturn.productDetails.product_size}</td>
                  <td>{selectedReturn.productDetails.product_quantity}</td>
                  <td>${selectedReturn.productDetails.product_price}</td>
                  <td>{selectedReturn.productDetails.product_status}</td>
                </tr>
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="success"
              onClick={() =>
                handleApproveReturn(selectedReturn.returnDetails.return_id)
              }
            >
              Approve Return
            </Button>
            <Button
              variant="primary"
              onClick={() =>
                handleProcessReturn(selectedReturn.returnDetails.return_id)
              }
            >
              Process Return
            </Button>
            <Button
              variant="danger"
              onClick={() =>
                handleRejectReturn(selectedReturn.returnDetails.return_id)
              }
            >
              Reject Return
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

export default ManageReturns;
