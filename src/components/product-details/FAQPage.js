import React, { useState } from "react";
import { Container, Accordion, Card } from "react-bootstrap";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { IoLogoWhatsapp } from "react-icons/io";
import { HiOutlineMail } from "react-icons/hi";
import "./TermsOfServices.scss";

const faqs = [
  {
    question: "What materials are your T-shirts made from?",
    answer:
      "Our T-shirts are made from a magical cotton-rich fabric—soft enough to make you wonder if you’re wearing clouds, but tough enough to survive your laundry skills. We’ve carefully curated the blend to give you comfort and durability, so it’s basically the superhero of fabrics!",
  },
  {
    question: "What sizes do you offer for your T-shirts?",
    answer:
      "We offer sizes ranging from S to XXL, so there’s a perfect fit for everyone! Not sure which size to pick? Check out our size chart here!",
  },
  {
    question: "How do I care for my T-shirt to maintain its quality?",
    answer:
      "To keep your T-shirt looking fresh and comfy, here’s what you should do:\n\nWash inside out with cold water\n\nAvoid bleach (your T-shirt doesn’t like that!)\n\nTumble dry on low or air dry to avoid shrinking\n\nIron on the reverse side if needed, but no heat on the print\n\nAnd remember, your T-shirt enjoys a gentle cycle much more than a rough one!",
  },
  {
    question: "How long does shipping take?",
    answer:
      "We’re working closely with our courier partners to ensure your T-shirt arrives safely. While we aim for fast delivery, we prioritize safe delivery over speed. On average, it takes about 7 days for your order to reach you.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Nope, we're currently shipping locally. But hey, who knows what the future holds?",
  },
  {
    question: "Can I exchange or return a T-shirt if it doesn’t fit?",
    answer:
      "Absolutely! We have a 15-day return and exchange policy. Just make sure the T-shirt is in good condition, and we’ve got you covered.",
  },
  {
    question: "How do I initiate a return or exchange?",
    answer:
      "Easy peasy! Head to the 'My Orders' section on our website, and you can initiate your return or exchange right from there.",
  },
  {
    question: "How does the return process work?",
    answer:
      "Once we get the T-shirt back, we’ll inspect it to make sure everything’s intact. After that, we’ll initiate the refund, which typically takes 3 to 5 business days to reflect in your account.",
  },
  {
    question: "Can I track my order once it’s shipped?",
    answer:
      "Yup! We’ll send you a tracking link once your order ships, thanks to our delivery partners. Just click the link and follow your T-shirt’s journey!",
  },
  {
    question: "How can I contact customer service if I have a question?",
    answer:
      "You can either email us at teetoise@gmail.com or WhatsApp us at 9266112217. We’ll be happy to help!",
  },
  {
    question: "What printing methods do you use for your T-shirts?",
    answer:
      "We use DTF (Direct-To-Film) printing method to make sure your funky designs stay vibrant and long-lasting—basically, prints that won’t bail on you after a few washes.",
  },
  {
    question: "Do you offer custom T-shirt designs?",
    answer:
      "For now, no. But we’re always open to ideas! Send us your wildest T-shirt ideas at teetoise@gmail.com, and who knows, we might just bring them to life!",
  },
  {
    question:
      "Will you be offering other products besides T-shirts in the future?",
    answer:
      "Heck yes! Once we’ve got our T-shirt game strong, we'll be looking to expand into hoodies and bottom wear soon. Stay tuned!",
  },
  {
    question: "Do your T-shirts shrink after washing?",
    answer:
      "Most of our T-shirts are bio-washed, so shrinking is minimal. Like with any fabric, there might be a tiny bit of shrinkage, but it won’t affect the size—just treat your T-shirt nicely!",
  },
  {
    question: "Can I cancel or modify my order after placing it?",
    answer:
      "You can cancel or modify your order before it ships. Once it’s shipped, you’ll have to wait until it arrives and then initiate a return or exchange if needed.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept credit cards, debit cards, and UPI. Payments are processed through Razorpay, one of the most secure and trusted payment gateways in India, so your transactions are always safe with us!",
  },
  {
    question: "Do you offer discounts or promotions?",
    answer:
      "Yes, we do! Check our website for the latest deals, and if it’s your first order, you might find a coupon code waiting just for you!",
  },
];

const FAQPage = () => {
  const [activeKey, setActiveKey] = useState(null);

  return (
    <Container className="terms-container">
      <h1>Frequently Asked Questions</h1>
      <hr />
      <Accordion
        activeKey={activeKey}
        onSelect={(selectedKey) => setActiveKey(selectedKey)}
      >
        {faqs.map((faq, index) => (
          <Accordion.Item
            eventKey={index.toString()}
            key={index}
            className="faq-card"
          >
            <Accordion.Header className="faq-question">
              {faq.question}
            </Accordion.Header>
            <Accordion.Body className="faq-answer">{faq.answer}</Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
      <div className="ml-4 mt-2">
        Still have questions?
        <div className="contact-links mt-2">
          <a href="mailto:teetoise@gmail.com" className="contact-link">
            <HiOutlineMail /> Email Us
          </a>
          <a href="https://wa.me/9266112217" className="contact-link">
            <IoLogoWhatsapp /> WhatsApp Us
          </a>
        </div>
      </div>
    </Container>
  );
};

export default FAQPage;
