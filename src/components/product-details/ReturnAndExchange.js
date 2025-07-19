import React from "react";
import { Container } from "react-bootstrap";
import { FaWhatsapp, FaEnvelope } from "react-icons/fa";
import "./TermsOfServices.scss";

const ReturnAndExchange = () => (
  <Container className="terms-container">
    <h1>Return & Exchange Policy</h1>
    <hr />
    <p>
      Hey, we get it—sometimes things just don’t work out. But don’t worry,
      we’ve got your back! If your order isn’t quite right, you can return or
      exchange it within <strong>15 days</strong> of delivery. Here’s how to
      make it super easy:
    </p>

    <p className="section-heading">1. Eligibility</p>
    <p>
      Just make sure the item is in its original condition—unworn, unwashed, and
      still has its tags (we love those little things).
    </p>

    <p className="section-heading">2. The Process</p>
    <p>
      Head over to our website, log in, and find the order section to start your
      return or exchange. It’s as easy as a few clicks! No complicated stuff, we
      promise.
    </p>

    <p className="section-heading">3. Refunds</p>
    <p>
      Once we get the returned item, we’ll check it out (no detective work, just
      a quick glance). After that, we’ll process your refund to the original
      payment method. Expect the money to land back in your account within{" "}
      <strong>7-10 business days</strong>.
    </p>

    <p className="section-heading">4. Exchanges</p>
    <p>
      Want a different size or color? No problem! Our courier partner will bring
      your shiny new product and at the same time, check that the original one
      is in good shape. If it passes the test, the swap is complete!
    </p>

    <div className="contact-info">
      <p>Got questions (or just want to say hi)? We’re always here to help!</p>
      <a href="mailto:teetoise@gmail.com">
        <FaEnvelope className="react-icon" />
        teetoise@gmail.com
      </a>
      <a
        href="https://wa.me/9266112217"
        target="_blank"
        rel="noopener noreferrer"
      >
        <br /> <br />
        <FaWhatsapp className="react-icon" /> +91 9266112217
      </a>
    </div>
  </Container>
);

export default ReturnAndExchange;
