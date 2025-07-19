import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Spinner, Form } from "react-bootstrap";
import { axiosInstance } from "../../axiosInstance";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false); // New state for tracking info modal
  const [orderStatus, setOrderStatus] = useState("");
  const [productStatus, setProductStatus] = useState("");
  const [trackingInfo, setTrackingInfo] = useState({
    trackingId: "",
    trackingLink: "",
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get(
          `/orders/orders`
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleViewOrder = (order) => {

    setSelectedOrder(order);
    setOrderStatus(order.order_status);
    setProductStatus(order.order_status);
    setProductStatus("");
    setTrackingInfo({
      trackingId: order.product_tracking_id || "",
      trackingLink: order.product_tracking_link || "",
    });
    setShowModal(true);
  };

  const handlePlaceOrder = async (orderId) => {
    try {
      await axiosInstance.post(`/orders/placeOrder`, {
        order_id: orderId,
      });
      alert("Order placed successfully!");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order");
    }
  };

  const handleUpdateOrderStatus = async (orderId) => {
    try {
      await axiosInstance.put(`/update-status`, {
        order_id: orderId,
        order_status: orderStatus,
        product_status: productStatus,
      });
      alert("Order and product statuses updated successfully!");
      setShowModal(false);
    } catch (error) {
      console.error("Error updating statuses:", error);
      alert("Failed to update statuses");
    }
  };

  const handleOpenTrackingModal = () => {
    setShowTrackingModal(true);
  };

  const handleCloseTrackingModal = () => {
    setShowTrackingModal(false);
  };

  const handleAddTrackingInfo = async (orderId) => {
    try {
      await axiosInstance.put(
        `/orders/add-tracking-info`,
        {
          order_id: orderId,
          product_tracking_id: trackingInfo.trackingId,
          product_tracking_link: trackingInfo.trackingLink,
        }
      );
      alert("Tracking information added and order marked as shipped!");
      setShowModal(false);
    } catch (error) {
      console.error("Error adding tracking info:", error);
      alert("Failed to add tracking information");
    }
  };

  const handleMarkAsDelivered = async (orderId) => {
    try {
      await axiosInstance.put(`/orders/mark-delivered`, {
        order_id: orderId,
      });
      alert("Order marked as delivered and tracking info removed!");
      setShowModal(false);
    } catch (error) {
      console.error("Error marking order as delivered:", error);
      alert("Failed to mark as delivered");
    }
  };

  return (
    <div>
      <h2>Manage Orders</h2>
      {loading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Recipient Name</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td>{order.public_order_id}</td>
                <td>{order.receipant_name}</td>
                <td>{order.amount}</td>
                <td>{order.order_status}</td>
                <td>{order.created_at}</td>
                <td>
                  <Button
                    variant="primary"
                    onClick={() => handleViewOrder(order)}
                    className="me-2"
                  >
                    View
                  </Button>
                  <Button
                    variant="success"
                    onClick={() => handlePlaceOrder(order.order_id)}
                  >
                    Place Order
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Modal for viewing order details */}
      {selectedOrder && (
        <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Order Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              <strong>Order Type:</strong> {selectedOrder.order_type}
            </p>
            <p>
              <strong>Recipient Name:</strong> {selectedOrder.receipant_name}
            </p>
            <p>
              <strong>Amount:</strong> {selectedOrder.amount}
            </p>
            <p>
              <strong>Discount Provided:</strong>{" "}
              {selectedOrder.coupon_discount}
            </p>
            <p>
              <strong>Contact:</strong> {selectedOrder.receipant_contact}
            </p>
            <p>
              <strong>Delivery Address:</strong>{" "}
              {selectedOrder.delivery_address}
            </p>
            <p>
              <strong>PIN Code:</strong> {selectedOrder.delivery_pin_code}
            </p>
            <p>
              <strong>Status:</strong> {selectedOrder.order_status}
            </p>
            <p>
              <strong>Order Date:</strong> {selectedOrder.created_at}
            </p>

            <h4>User Details</h4>
            <p>
              <strong>User name:</strong> {selectedOrder.user_name}
            </p>
            <p>
              <strong>User email:</strong> {selectedOrder.user_email}
            </p>
            <p>
              <strong>User number:</strong> {selectedOrder.user_mobile_number}
            </p>

            {/* Form for updating order status */}
            <Form.Group controlId="formOrderStatus">
              <Form.Label>Update Order Status</Form.Label>
              <Form.Control
                as="select"
                value={orderStatus}
                onChange={
                  ((e) => setOrderStatus(e.target.value))
                }
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </Form.Control>
            </Form.Group>

            {/* Form for updating product status */}
            <Form.Group controlId="formProductStatus" className="mt-3">
              <Form.Label>Update Product Status</Form.Label>
              <Form.Control
                as="select"
                value={productStatus}
                onChange={(e) => setProductStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </Form.Control>
            </Form.Group>

            {/* Order Items */}
            <h5 className="mt-3">Order Items</h5>
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
                {selectedOrder.order_items.map((item) => (
                  <tr key={item.product_id}>
                    <td>
                      <img
                        src={item.product_image}
                        alt={item.product_title}
                        style={{ height: "50px", objectFit: "contain" }}
                        loading="lazy"
                      />
                    </td>
                    <td>{item.product_title}</td>
                    <td>{item.product_size}</td>
                    <td>{item.product_quantity} pcs</td>
                    <td>${item.product_price}</td>
                    <td>{item.product_status}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => handleUpdateOrderStatus(selectedOrder.order_id)}
            >
              Update Status
            </Button>
            <Button
              variant="info"
              onClick={handleOpenTrackingModal} // Open tracking info modal
              disabled={selectedOrder.order_status === "delivered"}
            >
              Add Tracking Info
            </Button>
            <Button
              variant="success"
              onClick={() => handleMarkAsDelivered(selectedOrder.order_id)}
              disabled={selectedOrder.order_status === "confirmed"}
            >
              Mark as Delivered
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Modal for adding tracking information */}
      {selectedOrder && (
        <Modal show={showTrackingModal} onHide={handleCloseTrackingModal}>
          <Modal.Header closeButton>
            <Modal.Title>Add Tracking Information</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="formTrackingId">
              <Form.Label>Tracking ID</Form.Label>
              <Form.Control
                type="text"
                value={trackingInfo.trackingId}
                onChange={(e) =>
                  setTrackingInfo({
                    ...trackingInfo,
                    trackingId: e.target.value,
                  })
                }
                placeholder="Enter tracking ID"
              />
            </Form.Group>
            <Form.Group controlId="formTrackingLink" className="mt-2">
              <Form.Label>Tracking Link</Form.Label>
              <Form.Control
                type="text"
                value={trackingInfo.trackingLink}
                onChange={(e) =>
                  setTrackingInfo({
                    ...trackingInfo,
                    trackingLink: e.target.value,
                  })
                }
                placeholder="Enter tracking link"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseTrackingModal}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => handleAddTrackingInfo(selectedOrder.order_id)}
            >
              Save Tracking Info
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default ManageOrders;
