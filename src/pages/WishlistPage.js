import React, { useState, useEffect } from "react";
import {
  Card,
  Container,
  Row,
  Col,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../axiosInstance";
import "./WishlistPage.scss";
import { MdDelete } from "react-icons/md";
import { formatIndianCurrency } from "../utils/currencyFormatter";
import { toast } from "react-toastify";

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await axiosInstance.get("/wishlist");
        setWishlistItems(response.data);
      } catch (error) {
        handleRequestError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [navigate]);

  const handleRequestError = (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized. Logging out.");
      navigate("/login");
    } else {
      console.error("An error occurred:", error);
      setError("Failed to fetch data. Please try again later.");
      toast.error("Failed to fetch wishlist items. Please try again later.");
    }
  };

  const handleRemove = async (productId) => {
    try {
      await axiosInstance.delete("/wishlist", {
        data: { productId },
      });
      setWishlistItems(wishlistItems.filter((item) => item.id !== productId));
      toast.success("Item removed from wishlist.");
    } catch (error) {
      handleRequestError(error);
    }
  };

  const handleDeleteClick = (event, id) => {
    event.preventDefault();
    event.stopPropagation();
    handleRemove(id);
  };

  const handleRemoveAll = async () => {
    try {
      const response = await axiosInstance.delete("/wishlist/removeAll");
      if (response.status === 200) {
        setWishlistItems([]);
        toast.success("All items removed from wishlist.");
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      handleRequestError(error);
    }
  };

  return (
    <Container className="wishlist-container">
      {wishlistItems.length > 0 && (
        <div className="wishlist-header">
          <span style={{ fontSize: "1.5rem" }}>Your Wishlist</span>
          <button
            type="button"
            onClick={handleRemoveAll}
            className="remove-all-button"
          >
            Clear All
          </button>
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <div className="loading-spinner"></div>
      ) : wishlistItems.length > 0 ? (
        <Row className="mb-2">
          {wishlistItems.map((item) => (
            <Col key={item.id} xs={6} sm={6} md={4} lg={3} className="mb-1 p-1">
              <Link to={`/product/${item.product_name}`}>
                <Card className="wishlist-card">
                  <MdDelete
                    className="remove-item"
                    onClick={(event) => handleDeleteClick(event, item.id)}
                  />
                  <Card.Img
                    className="rounded-0"
                    variant="top"
                    src={item?.first_photo}
                  />
                  <Card.Body>
                    <Card.Title className="cardTitle">
                      {item.product_title}
                    </Card.Title>
                    <Card.Text>
                      <span style={{ fontWeight: "600" }}>
                        {formatIndianCurrency(item?.product_selling_price)}
                      </span>
                      {item.available_discount && (
                        <span style={{ fontSize: "10px" }}>
                          &nbsp;&nbsp;&nbsp;&nbsp;
                          {parseInt(item.available_discount, 10)}% off
                        </span>
                      )}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      ) : (
        <div className="empty-cart">
          <img
            src="https://storage.googleapis.com/turtleman-primary-bucket/public_images/website_stuff/pikachu.webp"
            alt="Empty Wishlist"
            className="empty-cart-image"
            loading="lazy"
          />
          <span style={{ fontSize: "1.5rem" }}>Nothing to see here.</span>
          <button
            type="button"
            className="button-primary"
            variant="warning"
            onClick={() => navigate("/products")}
          >
            Go to Products
          </button>
        </div>
      )}
    </Container>
  );
};

export default WishlistPage;
