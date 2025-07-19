import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col, Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../axiosInstance";
import ApplyCoupons from "../components/checkout/ApplyCoupons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CartPage.scss";
import { formatIndianCurrency } from "../utils/currencyFormatter";
import { useMediaQuery } from "react-responsive";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [addedButSoldOutItems, setAddedButSoldOutItems] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [editItem, setEditItem] = useState(null); // Store the item being edited
  const [availableSizes, setAvailableSizes] = useState([]);
  const [newSize, setNewSize] = useState("");
  const [newQuantity, setNewQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const [cartUpdated, setCartUpdated] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axiosInstance.get("/cart");
      setCartItems(response.data.items);
      setAddedButSoldOutItems(response.data.added_but_soldout);
      setGrandTotal(response.data.grand_total_price);
    } catch (error) {
      toast.error("Failed to fetch cart items.");
      console.error("Failed to fetch cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSizeAvailability = async (productId) => {
    try {
      const response = await axiosInstance.get(
        `/cart/sizeAvailability/${productId}`
      );
      setAvailableSizes(response.data.available_sizes);
    } catch (error) {
      toast.error("Failed to fetch size availability.");
      console.error("Failed to fetch size availability:", error);
    }
  };

  const handleRemove = async (item) => {
    setIsUpdating(true);
    try {
      await axiosInstance.delete("/cart", {
        data: {
          product_id: item.id,
          size: item.size,
          variant: item.variant,
        },
      });
      await fetchCart();
      setCartUpdated((prev) => prev + 1);
      toast.info("Item removed from cart.");
    } catch (error) {
      toast.error("Failed to remove item from cart.");
      console.error("Failed to remove item from cart:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Set the editItem by product_id and size (both to uniquely identify the item)
  const handleEdit = (item) => {
    setEditItem({ id: item.id, size: item.size });
    setNewSize(item.size);
    setNewQuantity(item.quantity);
    fetchSizeAvailability(item.id);
  };

  // When saving, include both old and new size in the payload
  const handleSave = async (item) => {
    setIsUpdating(true);
    try {
      await axiosInstance.put("/cart", {
        product_id: item.id,
        old_size: editItem.size,
        new_size: newSize,
        quantity: newQuantity,
        variant: item.variant,
      });
      setEditItem(null);
      await fetchCart();
      setCartUpdated((prev) => prev + 1);
      toast.success("Item updated successfully.");
    } catch (error) {
      toast.error("Failed to update cart item.");
      console.error("Failed to update cart item:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleQuantityChange = (e) => {
    const selectedQuantity = parseInt(e.target.value, 10);
    const maxQuantity =
      availableSizes.find((size) => size.size === newSize)
        ?.available_quantity || 1;
    if (selectedQuantity <= maxQuantity) {
      setNewQuantity(selectedQuantity);
    }
  };

  const handleCartUpdate = async () => {
    await fetchCart();
  };

  return (
    <Container className="cart-container">
      {isLoading ? (
        <div className="loading-spinner"></div>
      ) : (
        <>
          {cartItems.length === 0 && addedButSoldOutItems.length === 0 ? (
            <div className="empty-cart">
              <img
                src="https://storage.googleapis.com/turtleman-primary-bucket/public_images/website_stuff/pikachu.webp"
                alt="Empty Cart"
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
          ) : (
            <Row>
              <Col md={8} style={{ borderBottom: "2px solid #ddd" }}>
                {[...cartItems, ...addedButSoldOutItems].map((item, index) => {
                  const isSoldOut = !item.is_available;
                  const isInEditMode =
                    editItem &&
                    editItem.id === item.id &&
                    editItem.size === item.size;

                  return (
                    <>
                      <Card
                        key={index}
                        className={`cart-card rounded-0 ${
                          isSoldOut ? "sold-out" : ""
                        }`}
                      >
                        <Row className="g-0">
                          <Col xs={4} md={3}>
                            <Link to={`/product/${item.product_name}`}>
                              <Card.Img
                                variant="top"
                                src={item.photo}
                                className="cart-item-image rounded-0"
                              />
                            </Link>
                          </Col>
                          <Col xs={8} md={9}>
                            <Card.Body className="card-right-part">
                              <div>
                                <Card.Title>{item.product_title}</Card.Title>

                                <div className="size-row">
                                  <Form.Group controlId={`formSize-${item.id}`}>
                                    <div className="size-variant">
                                      <Form.Label>Size</Form.Label>
                                      <Form.Control
                                        as="select"
                                        value={
                                          isInEditMode ? newSize : item.size
                                        }
                                        onChange={(e) =>
                                          setNewSize(e.target.value)
                                        }
                                        className="size-dropdown"
                                        disabled={!isInEditMode}
                                      >
                                        {availableSizes.length > 0 ? (
                                          availableSizes.map(
                                            (sizeOption, idx) => (
                                              <option
                                                key={idx}
                                                value={sizeOption.size}
                                              >
                                                {sizeOption.size}
                                              </option>
                                            )
                                          )
                                        ) : (
                                          <option value={item.size}>
                                            {item.size}
                                          </option>
                                        )}
                                      </Form.Control>
                                    </div>
                                  </Form.Group>
                                  <Form.Group
                                    controlId={`formQuantity-${item.id}`}
                                  >
                                    <div className="size-variant">
                                      <Form.Label>Quantity</Form.Label>
                                      <Form.Control
                                        as="select"
                                        value={
                                          isInEditMode
                                            ? newQuantity
                                            : item.quantity
                                        }
                                        onChange={handleQuantityChange}
                                        className="size-dropdown"
                                        disabled={!isInEditMode}
                                      >
                                        {Array.from(
                                          {
                                            length: Math.min(
                                              5,
                                              item.available_quantity || 1
                                            ),
                                          },
                                          (_, i) => i + 1
                                        ).map((num) => (
                                          <option key={num} value={num}>
                                            {num}
                                          </option>
                                        ))}
                                      </Form.Control>
                                    </div>
                                  </Form.Group>
                                </div>

                                <Card.Text className="size-variant fw-bold">
                                  {formatIndianCurrency(item?.total_price)}
                                </Card.Text>

                                {isSoldOut && (
                                  <div className="sold-out-label">
                                    Not Available
                                  </div>
                                )}
                                <div className="edit-save-button">
                                  <span
                                    onClick={() => handleRemove(item)}
                                    disabled={isUpdating}
                                    className="button-react"
                                  >
                                    Remove
                                  </span>
                                  {!isSoldOut && !isInEditMode && (
                                    <span
                                      onClick={() => handleEdit(item)}
                                      className="button-react"
                                      disabled={isUpdating}
                                    >
                                      Edit
                                    </span>
                                  )}
                                  {isInEditMode && (
                                    <>
                                      <span
                                        onClick={() => setEditItem(null)}
                                        className="button-react"
                                        disabled={isUpdating}
                                      >
                                        Cancel
                                      </span>
                                      <span
                                        onClick={() => handleSave(item)}
                                        className="button-react"
                                        disabled={isUpdating}
                                      >
                                        {isUpdating ? (
                                          <span className="spinner-border spinner-border-sm"></span>
                                        ) : (
                                          "Save"
                                        )}
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </Card.Body>
                          </Col>
                        </Row>
                      </Card>
                    </>
                  );
                })}
              </Col>
              <Col md={4}>
                <div className="cart-summary">
                  <ApplyCoupons
                    totalPrice={grandTotal}
                    handleCartUpdate={handleCartUpdate}
                    cartUpdated={cartUpdated}
                  />
                </div>
              </Col>
            </Row>
          )}
        </>
      )}
    </Container>
  );
};

export default CartPage;
