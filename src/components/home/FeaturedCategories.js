import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./FeaturedCategories.scss";

const FeaturedCategories = ({ categories }) => {
  const navigate = useNavigate();

  const handleCategoryClick = (tags) => {
    const tagArray = Array.isArray(tags) ? tags : [tags];

    const uppercasedTags = tagArray.map((tag) => tag.toUpperCase());

    const queryString = `tags=${encodeURIComponent(uppercasedTags.join(","))}`;
    localStorage.setItem("tagQuery", queryString);
    navigate(`/products?${queryString}`);
  };

  return (
    <Container className="featured-categories">
      <Row>
        <h6
          className="mb-3 mt-3"
          style={{ fontWeight: "600", textAlign: "center" }}
        >
          SHOP BY CATEGORIES
        </h6>
        {Object.entries(categories).map(
          ([name, { image_url, tags }], index) => (
            <Col
              key={index}
              xs={6}
              md={3}
              className="category-item mb-1"
              onClick={() => handleCategoryClick(tags)}
            >
              <img
                src={image_url}
                alt={name}
                className="category-image"
                loading="lazy"
              />
              <div className="category-name">{name}</div>
            </Col>
          )
        )}
      </Row>
    </Container>
  );
};

export default FeaturedCategories;
