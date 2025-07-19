import React from "react";
import { Container } from "react-bootstrap";
import "./TermsOfServices.scss";

const TermsOfServices = () => (
  <Container className="terms-container">
    <h1>Terms of Service</h1>
    <hr />
    <p>
      <span className="section-heading">1. Acceptance of Terms</span> <br />
      By hanging out on Teetoise, you’re agreeing to play by our rules. If
      you’re not cool with these terms, we totally understand if you choose not
      to stick around. No hard feelings!
    </p>
    <p>
      <span className="section-heading">2. Orders and Fulfillment</span> <br />
      When you order from us, you’re placing your trust in our magical T-shirt
      delivery powers. We’ll confirm your order with an email that’s almost as
      exciting as your new tees. If something goes awry or we decide to cancel
      your order, we promise it’s nothing personal. We’re just trying to keep
      things running smoothly.
    </p>
    <p>
      <span className="section-heading">3. Returns and Exchanges</span> <br />
      Not 100% thrilled with your order? No worries! You can return those items
      within the return period specified on our website. Start the return
      process via the order section on our site. For exchanges, we’ll send out a
      replacement faster than you can say “T-shirt,” but only after our courier
      partners check that your returned item is still in tip-top shape.
    </p>
    <p>
      <span className="section-heading">4. Payment</span> <br />
      Pay for your goodies using the methods listed on our website. Our checkout
      is secure, so your payment info is safer than a T-shirt in a closet.
      Prices might change, but you’ll pay the price shown when you check out.
    </p>
    <p>
      <span className="section-heading">5. Shipping</span> <br />
      We offer shipping options that let you choose how fast you want your new
      favorite T-shirt to arrive. If your package gets stuck in transit or
      arrives late, we’ll be just as disappointed as you are, but we can’t be
      held responsible for carrier hiccups.
    </p>
    <p>
      <span className="section-heading">6. Intellectual Property</span> <br />
      All the cool stuff on Teetoise—like our text, images, and logos—belongs to
      us. Think of it as our secret sauce. Please don’t copy or use our content
      without asking us first.
    </p>
    <p>
      <span className="section-heading">7. Limitation of Liability</span> <br />
      We’re here to provide awesome T-shirts, not to be superheroes. So, if
      something goes wrong that’s beyond our control, we won’t be held
      responsible for any unexpected troubles or damages.
    </p>
    <p>
      <span className="section-heading">8. Governing Law</span> <br />
      Our terms are governed by the laws of our country. Any disputes will be
      settled mutually or if need be, in the legal arena.
    </p>
    <p>
      <span className="section-heading">9. Changes to Terms</span> <br />
      We might tweak these terms now and then. If we do, we’ll post the updates
      right here. If you keep using our site, you’re saying you’re cool with the
      new terms.
    </p>
    <p>
      <span className="section-heading">10. Contact Us</span> <br />
      Got questions or concerns? Don’t be shy! Reach out to us at{" "}
      <a href="mailto:teetoise@gmail.com">teetoise@gmail.com</a> and we’ll be
      happy to help.
    </p>
  </Container>
);

export default TermsOfServices;
