const displayRazorpay = async (amount, orderId) => {
  const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

  if (!res) {
    alert("Failed to load Razorpay SDK");
    return;
  }

  const options = {
    key: "YOUR_RAZORPAY_KEY_ID",
    amount: amount,
    currency: "INR",
    name: "Turtleman Clothing",
    description: "Order Payment",
    order_id: orderId,
    handler: async function (response) {
      const data = {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        signature: response.razorpay_signature,
      };

      const result = await fetch("/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (result.status === 200) {
        alert("Payment successful and order placed");
      } else {
        alert("Payment verification failed");
      }
    },
    prefill: {
      name: "Customer Name",
      email: "customer@example.com",
      contact: "9000000000",
    },
    theme: { color: "#3399cc" },
  };

  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
};
