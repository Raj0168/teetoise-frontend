import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaYoutube, FaInstagram, FaFacebookF } from "react-icons/fa";
import { FaExternalLinkAlt } from "react-icons/fa";
import { MdLocalShipping, MdCreditCard } from "react-icons/md";
import "./Footer.scss";

const Footer = () => (
  <footer className="footer">
    <Container>
      <Row className="footer-content">
        <Col md={4} className="footer-left">
          <div className="footer-info">
            <div className="footer-info-item">
              <MdLocalShipping className="footer-info-icon" />
              <p>15 Days Returns & Exchange</p>
            </div>
            <div className="footer-info-item">
              <MdCreditCard className="footer-info-icon" />
              <p>
                Secure Payment with{" "}
                <a
                  style={{ color: "#d1ac04" }}
                  href="https://razorpay.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Razorpay <FaExternalLinkAlt style={{ fontSize:"14px" }} />
                </a>
              </p>
            </div>
          </div>
          <div className="footer-social-media">
            Follow us on&nbsp;&nbsp;
            <a
              href="https://www.instagram.com/teetoise/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="footer-info-icon" />
            </a>
            <a
              href="https://www.facebook.com/share/BNdEYtw4ePpitSXa/?mibextid=qi2Omg"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF className="footer-info-icon" />
            </a>
            <a
              href="https://www.youtube.com/@teetoise"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaYoutube className="footer-info-icon" />
            </a>
          </div>
        </Col>
        <Col md={8} className="footer-right">
          <div className="footer-links">
            <Link className="footer-link" to="/faqs">
              FAQs
            </Link>
            <Link className="footer-link" to="/privacy-policy">
              Privacy Policy
            </Link>
            <Link className="footer-link" to="/terms-of-service">
              Terms of Service
            </Link>
            <Link className="footer-link" to="/contact-us">
              Contact Us
            </Link>
            <Link className="footer-link" to="/shipping-policy">
              Shipping Policy
            </Link>
            <Link className="footer-link" to="/returns-and-exchange">
              Returns & Exchange
            </Link>
            <Link className="footer-link" to="/about-us">
              About Us
            </Link>
          </div>
        </Col>
      </Row>
      <p className="copyright">&copy; 2024 Teetoise</p>
    </Container>
  </footer>
);

export default Footer;
