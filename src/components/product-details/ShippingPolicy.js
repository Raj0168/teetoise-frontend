import React from "react";
import { Container } from "react-bootstrap";
import { FaExternalLinkAlt } from "react-icons/fa";
import "./TermsOfServices.scss";

const ShippingPolicy = () => (
  <Container className="terms-container">
    <h1>Shipping Policy</h1>
    <hr />
    <p>
      At Teetoise, we want your favorite tees to reach you as quickly as
      possible. That’s why we’ve teamed up with{" "}
      <a
        href="https://shipcorrect.com/aboutUs.php"
        target="_blank"
        rel="noopener noreferrer"
      >
        ShipCorrect <FaExternalLinkAlt className="link-icon" />
      </a>
      , a trusted third-party shipping service, to handle our deliveries. They
      help us ensure your order is delivered safely and on time.
    </p>

    <p>
      As we’re using ShipCorrect’s services, we follow their shipping policies
      closely. This means everything from shipping times to returns is handled
      according to their{" "}
      <a
        href="https://shipcorrect.com/shippingpolicy.html"
        target="_blank"
        rel="noopener noreferrer"
      >
        official policies <FaExternalLinkAlt className="link-icon" />
      </a>
      . Rest assured, we’re working hard to make sure everything goes smoothly!
    </p>

    <p>
      <span className="section-heading">Delivery Times</span>
      <br />
      ShipCorrect is known for prompt deliveries, and we aim to meet these
      expectations. Delivery times may vary based on your location, but
      typically fall within 3-7 business days.
    </p>
    <p>
      <span className="section-heading">Tracking Your Order</span>
      <br />
      As soon as your order is processed, you’ll get an email with your tracking
      number. You can keep tabs on your shipment directly through ShipCorrect’s
      platform, and track it any time{" "}
      <a
        href="https://www.shiprocket.in/shipment-tracking/"
        target="_blank"
        rel="noopener noreferrer"
      >
        here <FaExternalLinkAlt className="link-icon" />
      </a>
      .
    </p>

    <p>
      <span className="section-heading">Shipping Costs</span>
      <br />
      We offer free shipping on all orders, so there are no extra costs at
      checkout. Just another way we’re making your shopping experience even
      better!
    </p>

    <p>
      <span className="section-heading">Pickup for Exchanges and Returns</span>
      <br />
      We understand that sometimes things don’t fit quite right or you change
      your mind. No worries! If you need to exchange or return an item, we’ve
      got you covered. As part of our commitment to a hassle-free experience,
      ShipCorrect will arrange a pickup for your exchange or return.
    </p>
    <ul>
      <li>
        Once your return or exchange request is approved, a ShipCorrect
        representative will coordinate the pickup.
      </li>
      <li>
        We’ll share the pickup details with you via email, including the date
        and time of pickup.
      </li>
      <li>
        Please make sure your items are securely packaged and ready for
        collection.
      </li>
      <li>
        Exchanges or returns are typically processed within 7-10 business days
        after the item is picked up.
      </li>
    </ul>
    <p>
      For more details on how exchanges and returns work, check out
      ShipCorrect’s{" "}
      <a
        href="https://shipcorrect.com/shippingpolicy.html"
        target="_blank"
        rel="noopener noreferrer"
      >
        return policy <FaExternalLinkAlt className="link-icon" />
      </a>
      .
    </p>

    <p>
      <span className="section-heading">Lost or Damaged Shipments</span>
      <br />
      While we do everything we can to make sure your order arrives safely,
      sometimes things go awry. If your package is lost or damaged during
      transit, ShipCorrect’s policies apply. Just reach out to us, and we’ll
      work with ShipCorrect to sort it out quickly.
    </p>

    <p>
      Want to read more? You can find ShipCorrect’s complete shipping policy{" "}
      <a
        href="https://shipcorrect.com/shippingpolicy.html"
        target="_blank"
        rel="noopener noreferrer"
      >
        here <FaExternalLinkAlt className="link-icon" />
      </a>
      .
    </p>
  </Container>
);

export default ShippingPolicy;
