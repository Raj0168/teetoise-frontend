import React from "react";
import { Container } from "react-bootstrap";
import { FaWhatsapp, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import "./TermsOfServices.scss";

const ContactUs = () => (
  <Container className="terms-container">
    <h1>Contact Us</h1>
    <hr />
    <p>
      Got questions? We’ve got answers (and probably more tees too)! We’re
      always here to chat about our awesome apparel or help you out with your
      order. Reach us through any of the ways below:
    </p>

    <div className="contact-info">
      <div className="mb-1">
        <FaMapMarkerAlt className="react-icon" />
        <span className="contact-detail">Delhi, India - 110091</span>
      </div>
      <div className="mb-1">
        <FaWhatsapp className="react-icon" />
        <a
          href="https://wa.me/9266112217"
          target="_blank"
          rel="noopener noreferrer"
        >
          +91 9266112217
        </a>
      </div>
      <div className="mb-1">
        <FaEnvelope className="react-icon" />
        <a href="mailto:teetoise@gmail.com">
          teetoise@gmail.com
        </a>
      </div>
    </div>
  </Container>
);

export default ContactUs;
