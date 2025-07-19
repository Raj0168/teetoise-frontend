import React, { useState, useEffect } from "react";
import { Card, Button, Row, Col, Spinner, Container } from "react-bootstrap";
import { FaArrowUp } from "react-icons/fa";
import "./TrendingProducts.scss";
import { axiosInstance } from "../../axiosInstance";
import { formatIndianCurrency } from "../../utils/currencyFormatter";

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const fetchTrendingProducts = async () => {
    setIsFetching(true);
    try {
      const { data } = await axiosInstance.get(`/product/new-arrivals`);
      setProducts(data);
    } catch (error) {
      console.error("Error fetching trending products:", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchTrendingProducts();
  }, []);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Container className="mb-3 trending-page">
      {isFetching && <div className="loading-overlay"></div>}

      <Row>
        {products.map((product) => (
          <Col key={product.id} xs={6} md={6} lg={3} className="useless-class">
            <Card
              className="product-card rounded-0"
              onClick={() =>
                (window.location.href = `/product/${product?.product_name}`)
              }
            >
              <Card.Img className="image" variant="top" src={product.photo} />
              <Card.Body className="p-2">
                <div className="card-title">{product.product_title}</div>
                <span className="product-gender">{product?.gender}</span>
                <span className="mrp">
                  {formatIndianCurrency(product.product_selling_price)}
                  <span className="actual-price">
                    {formatIndianCurrency(product?.product_price)}
                  </span>
                </span>
                <span className="discount">
                  &nbsp;(
                  {parseInt(product?.available_discount, 10)}% off)
                </span>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {!isFetching && products.length === 0 && (
        <div className="text-center my-4">No products available</div>
      )}
      <Button
        className="back-to-top"
        onClick={handleBackToTop}
        style={{ display: window.scrollY > 300 ? "block" : "none" }}
      >
        <FaArrowUp />
      </Button>
    </Container>
  );
};

export default NewArrivals;
