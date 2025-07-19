import React from "react";
import { Container } from "react-bootstrap";
import "./TermsOfServices.scss";

const TermsOfServices = () => (
  <Container className="terms-container">
    <h1>Teetoise Privacy Policy</h1>
    <hr />
    <p>
      At <strong>Teetoise</strong>, we love our T-shirts, but we love your
      privacy even more. We know sharing your info with us is a big deal, and we
      promise to keep it safe—just like that favorite T-shirt you never let
      anyone borrow. So, here’s the scoop on what we do with your data when you
      swing by our website:
    </p>

    <p className="section-heading">Information We Collect</p>
    <p>
      <strong>Personal Info</strong>: When you place an order or sign up, we’ll
      ask for the basics—like your name, email, shipping address, and payment
      info. You know, the stuff we need to get those awesome tees from our place
      to yours.
    </p>
    <p>
      <strong>Fun (But Not Creepy) Data</strong>: We also collect things like
      your IP address and which pages you visit—nothing weird, just enough to
      help us figure out how you’re using the site and how we can make it even
      better.
    </p>

    <p className="section-heading">How We Use Your Info</p>
    <ul>
      <li>
        <strong>Shipping Your Stuff</strong>: We need your info to send your new
        favorite T-shirt straight to your door (or your office, if you’re trying
        to show off to coworkers).
      </li>
      <li>
        <strong>Customer Service</strong>: If you have questions or concerns, we
        use your info to get back to you ASAP. No robots, just real people here.
      </li>
      <li>
        <strong>Making the Site Awesome</strong>: We use data to improve your
        shopping experience, so next time, you can get those tees even faster.
      </li>
      <li>
        <strong>Keeping Things Safe</strong>: We’re all about secure shopping,
        so your info helps us fight off any bad guys (not literal bad guys, just
        internet ones).
      </li>
    </ul>

    <p className="section-heading">Data Sharing</p>
    <p>
      We promise—no shady business here. We don’t sell or trade your info with
      anyone. We only share your details with trustworthy partners (like
      delivery folks and payment processors) who need it to get your order to
      you. That’s it. Pinky promise.
    </p>

    <p className="section-heading">Data Security</p>
    <p>
      We’ve locked things down tighter than a vault. Your info is kept safe with
      <strong>NGINX and Certbot</strong> on <strong>EC2 server</strong> and{" "}
      <strong>Amplify</strong>; and our SSL certificate means no one’s snooping
      on your data.
    </p>

    <p className="section-heading">Your Rights</p>
    <p>
      You’re in control. Want to see what data we have on you? Want to change
      it? Delete it? No problem. Just hit us up at{" "}
      <a href="mailto:teetoise@gmail.com">teetoise@gmail.com</a>, and we’ll sort
      it out faster than you can say "crew neck."
    </p>

    <div className="contact-info">
      <p>Got questions? We’re always happy to help!</p>
      <a href="mailto:teetoise@gmail.com">Email: teetoise@gmail.com</a>
    </div>
  </Container>
);

export default TermsOfServices;
