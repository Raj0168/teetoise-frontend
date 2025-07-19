import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import './ShopByOccasion.scss'; 

const ShopByOccasion = ({ occasions }) => {
  return (
    <Container className="shop-by-occasion">
      <Row>
        {Object.entries(occasions).map(([name, imageUrl], index) => (
          <Col
            key={index}
            xs={6}
            md={4}
            className="occasion-item"
            style={{ backgroundImage: `url(${imageUrl})` }}
          >
            <div className="occasion-name">{name}</div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ShopByOccasion;
