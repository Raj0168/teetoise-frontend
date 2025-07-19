import React, { useState } from "react";
import axios from "axios";

const PaymentButton = () => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);

    try {
      const response = await axios.post("/api/payment/initiate-payment", {
        delivery_address: "123 Street, City",
        receipant_name: "John Doe",
        receipant_contact: "9876543210",
      });

      const {
        order_id,
        amount,
        userDetails,
        delivery_address,
        receipant_name,
        receipant_contact,
      } = response.data;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: amount, 
        currency: "INR",
        name: "Your Business Name",
        description: "Order Payment",
        image: "https://storage.googleapis.com/turtleman-primary-bucket/public_images/logos/TEEEEEEEHEEEE.jpg",
        order_id: order_id,
        callback_url: `${apiUrl}api/payment/verify-payment`,
        prefill: {
          name: userDetails.name,
          email: userDetails.email,
          contact: userDetails.mobile,
        },
        notes: {
          address: delivery_address,
        },
        theme: {
          color: "#3399cc",
        },
        handler: async function (response) {
          try {
            await axios.post("/api/payment/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              user_id: userDetails.id,
              delivery_address,
              receipant_name,
              receipant_contact,
            });

            alert("Payment successful!");
          } catch (error) {
            console.error("Error handling payment success", error);
            alert("Payment failed.");
          }
        },
        modal: {
          ondismiss: function () {
            alert("Payment canceled.");
          },
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Error initiating payment", error);
      alert("Payment initiation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button type="button" onClick={handlePayment} disabled={loading}>
      {loading ? "Processing..." : "Pay Now"}
    </button>
  );
};

export default PaymentButton;
