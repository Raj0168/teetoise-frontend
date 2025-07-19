import React, { useState, useEffect } from "react";
import { Button, Form, ListGroup, Spinner } from "react-bootstrap";
import { axiosInstance } from "../../axiosInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ApplyCoupons.scss";
import { formatIndianCurrency } from "../../utils/currencyFormatter";
import okayImage from "../../assets/images/okay.webp";
import { useNavigate } from "react-router-dom";
import { debounce } from "lodash";

const ApplyCoupons = ({ cartUpdated }) => {
  const [coupons, setCoupons] = useState([]);
  const [checkoutDetails, setCheckoutDetails] = useState(null);
  const [selectedCoupon, setSelectedCoupon] = useState("");
  const [specificCoupon, setSpecificCoupon] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAvailableCoupons, setShowAvailableCoupons] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const navigate = useNavigate();

  const debouncedFetchCheckoutDetails = debounce(async () => {
    await fetchCheckoutDetails();
  }, 300);

  useEffect(() => {
    debouncedFetchCheckoutDetails();

    return () => {
      debouncedFetchCheckoutDetails.cancel();
    };
  }, []);

  useEffect(() => {
    if (cartUpdated) {
      fetchCheckoutDetails();
    }
  }, [cartUpdated]);

  useEffect(() => {
    if (specificCoupon) {
      const timer = setTimeout(() => {
        setSpecificCoupon(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [specificCoupon]);

  const fetchAvailableCoupons = async () => {
    try {
      const response = await axiosInstance.get("/coupons/available");

      if (response.data.length === 0) {
        toast.info("No available coupons at the moment.");
      } else {
        setCoupons(response.data);
        setShowAvailableCoupons(true);
      }
    } catch (err) {
      toast.error("Failed to fetch available coupons.");
      console.error(err);
    }
  };

  const fetchCheckoutDetails = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/coupons/apply", {
        couponCode: selectedCoupon || "",
      });
      setCheckoutDetails(response.data);
    } catch (err) {
      toast.error("Failed to fetch checkout details.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCoupon = async (couponCode = selectedCoupon) => {
    if (!couponCode) {
      toast.error("Please enter a valid coupon code.");
      return;
    }
    if (couponCode === "IAMSPECIAL") {
      setSpecificCoupon(true);
      return;
    }
    setLoading(true);

    try {
      const response = await axiosInstance.post("/coupons/apply", {
        couponCode,
      });
      setCheckoutDetails(response.data);
      toast.success("Coupon applied successfully!");
    } catch (err) {
      toast.error("Failed to apply coupon.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoupon = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/coupons/remove-coupon");
      setSelectedCoupon("");
      setCheckoutDetails(response.data);
      toast.info("Coupon removed successfully.");
      // onCartUpdate();
    } catch (err) {
      toast.error("Failed to remove coupon.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      const response = await axiosInstance.post("/checkout/", {
        couponCode: selectedCoupon || "",
      });
      if (response.data) {
        navigate("/order-summary");
      } else {
        toast.error("Checkout failed. Please try again.");
      }
    } catch (err) {
      toast.error("Failed to process checkout.");
      console.error(err);
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-spinner"></div>;
  }

  const renderCheckoutDetails = () => {
    if (!checkoutDetails) return <p>No checkout details available.</p>;

    return (
      <div className="checkout-details">
        <div className="summary">
          <div className="checkout-item">
            <span>Product Total: </span>
            <span>
              {formatIndianCurrency(
                checkoutDetails?.totalAmountBeforeDiscount
              ) || 0}
            </span>
          </div>
          <div className="checkout-item">
            <span>Coupon Discount:</span>
            <span style={{ color: "green" }}>
              {formatIndianCurrency(checkoutDetails?.couponDiscount) || 0}
            </span>
          </div>
          <div className="checkout-item">
            <span>Payment Amount: </span>
            <span style={{ fontWeight: "600" }}>
              {formatIndianCurrency(
                checkoutDetails?.totalAmountAfterDiscount
              ) || 0}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="apply-coupons">
      <h6>Apply Coupons</h6>
      <Form>
        <Form.Group controlId="formCouponCode">
          <div className="d-flex gap-2">
            <Form.Control
              type="text"
              style={{ fontSize: "12px" }}
              placeholder="Coupon Code"
              value={selectedCoupon}
              onChange={(e) => setSelectedCoupon(e.target.value.toUpperCase())}
            />
            <button
            type="button"
              style={{ fontSize: "14px" }}
              className="apply-button"
              onClick={() => handleApplyCoupon()}
              disabled={!selectedCoupon}
            >
              Apply
            </button>
            {selectedCoupon && (
              <button
              type="button"
                style={{ fontSize: "14px" }}
                className="remove-button"
                onClick={handleRemoveCoupon}
              >
                Remove
              </button>
            )}
          </div>
        </Form.Group>
      </Form>

      <button
      type="button"
        style={{ fontSize: "12px", marginTop: "10px" }}
        className="button-grey"
        onClick={fetchAvailableCoupons}
        disabled={showAvailableCoupons}
      >
        View Available Coupons
      </button>

      {showAvailableCoupons && (
        <div className="mt-3">
          <ListGroup
            style={{ maxHeight: "200px", overflowY: "auto", margin: "0" }}
          >
            {coupons.map((coupon) => (
              <ListGroup.Item key={coupon.id}>
                <div className="d-flex gap-2 justify-content-between align-items-center">
                  <div style={{ fontSize: "12px" }}>
                    <strong>{coupon.code}</strong>
                    <div>
                      Get {coupon.discount_value}% off up to ₹
                      {coupon.max_discount_value}
                    </div>
                  </div>
                  <button
                  type="button"
                    className="apply-button"
                    style={{ fontSize: "12px" }}
                    onClick={() => {
                      setSelectedCoupon(coupon.code);
                      handleApplyCoupon(coupon.code);
                      setShowAvailableCoupons(false);
                    }}
                  >
                    Apply
                  </button>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      )}

      {specificCoupon && (
        <>
          <img
            src={okayImage}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            frameBorder="0"
            allowFullScreen
            loading="lazy"
            className="mt-4 mb-4"
          ></img>
        </>
      )}

      <h6 className="mt-3 pt-2 border-top">Checkout Details</h6>
      {renderCheckoutDetails()}

      <button
      type="button"
        style={{ fontSize: "12px", marginTop: "10px" }}
        className="w-100 checkout-button"
        onClick={handleCheckout}
        disabled={checkoutLoading}
      >
        {checkoutLoading ? (
          <Spinner as="span" animation="border" size="sm" />
        ) : (
          "Checkout"
        )}
      </button>
    </div>
  );
};

export default ApplyCoupons;
