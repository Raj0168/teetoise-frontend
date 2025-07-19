import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Dropdown,
  Modal,
  Form,
  Card,
} from "react-bootstrap";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { axiosInstance } from "../axiosInstance";
import "./ProductsPage.scss";
import { FaFilter } from "react-icons/fa";
import queryString from "query-string";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { formatIndianCurrency } from "../utils/currencyFormatter";
import colorCodes from "../assets/styles/colorCodes";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({
    sizes: [],
    cloth_fit: [],
    gender: [],
    product_style: [],
    color: [],
    minPrice: 250,
    maxPrice: 750,
    available: true,
  });

  const [tempFilters, setTempFilters] = useState(filters);
  const location = useLocation();
  const hasFetchedData = useRef(false);

  const navigate = useNavigate();

  useEffect(() => {
    const parsedFilters = queryString.parse(location.search, {
      arrayFormat: "comma",
    });
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...parsedFilters,
    }));
    setTempFilters((prevTempFilters) => ({
      ...prevTempFilters,
      ...parsedFilters,
    }));
  }, [location.search]);

  useEffect(() => {
    if (hasFetchedData.current) {
      fetchProducts();
    } else {
      hasFetchedData.current = true;
    }
  }, [filters]);

  const convertFiltersToUpperCase = (filters) => {
    return {
      ...filters,
      sizes: Array.isArray(filters.sizes)
        ? filters.sizes.map((size) => size.toUpperCase())
        : [],
      cloth_fit: Array.isArray(filters.cloth_fit)
        ? filters.cloth_fit.map((fit) => fit.toUpperCase())
        : [],
      gender: Array.isArray(filters.gender)
        ? filters.gender.map((gender) => gender.toUpperCase())
        : [],
      product_style: Array.isArray(filters.product_style)
        ? filters.product_style.map((style) => style.toUpperCase())
        : [],
      color: Array.isArray(filters.color)
        ? filters.color.map((color) => color.toUpperCase())
        : [],
    };
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const upperCaseFilters = convertFiltersToUpperCase(filters);
      const query = queryString.stringify(upperCaseFilters, {
        arrayFormat: "comma",
      });

      const response = await axiosInstance.get(
        `/product/getFilteredResults?${query}`
      );
      setProducts(response.data.products);
    } catch (error) {
      console.error("Error fetching products", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (sortBy, sortOrder) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      sortBy,
      sortOrder,
    }));
  };

  const handleFilterChange = (filterType, value) => {
    setTempFilters((prevTempFilters) => {
      const newTempFilters = { ...prevTempFilters };
      if (Array.isArray(newTempFilters[filterType])) {
        newTempFilters[filterType] = newTempFilters[filterType].includes(value)
          ? newTempFilters[filterType].filter((item) => item !== value)
          : [...newTempFilters[filterType], value];
      } else {
        newTempFilters[filterType] = value;
      }
      return newTempFilters;
    });
  };

  const handleSliderChange = (value) => {
    setTempFilters((prevTempFilters) => ({
      ...prevTempFilters,
      minPrice: value[0],
      maxPrice: value[1],
    }));
  };

  const handleFilterApply = () => {
    setFilters(tempFilters);
    setShowFilterModal(false);
  };

  const handleClearFilter = (filterType) => {
    setTempFilters((prevTempFilters) => ({
      ...prevTempFilters,
      [filterType]: Array.isArray(prevTempFilters[filterType]) ? [] : "",
    }));
  };

  const handleRemoveAllFilters = () => {
    setTempFilters({
      sizes: [],
      cloth_fit: [],
      gender: [],
      product_style: [],
      color: [],
      minPrice: 250,
      maxPrice: 750,
      available: true,
    });
  };

  return (
    <Container className="products-page">
      <Row className="d-flex justify-content-between align-items-center mb-2">
        <Col xs={6} className="d-flex justify-content-start">
          <Dropdown>
            <Dropdown.Toggle variant="secondary" className="p-1 rounded-0">
              Sort
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleSortChange("price", "asc")}>
                Price (Low to High)
              </Dropdown.Item>
              <Dropdown.Item onClick={() => handleSortChange("price", "desc")}>
                Price (High to Low)
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => handleSortChange("popularity", "desc")}
              >
                Popularity
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
        <Col xs={6} className="d-flex justify-content-end">
          <button
            type="button"
            onClick={() => setShowFilterModal(true)}
            className="filter-button d-flex align-items-center"
          >
            <FaFilter className="me-2" />
            Filter
          </button>
        </Col>
      </Row>

      {loading ? (
        <div className="loading-container"></div>
      ) : (
        <Row>
          {products.length > 0 ? (
            products.map((product) => (
              <Col
                key={product.id}
                xs={6}
                md={6}
                lg={3}
                className="useless-class"
              >
                <Card
                  className="product-card rounded-0"
                  onClick={() =>
                    (window.location.href = `/product/${product?.product_name}`)
                  }
                >
                  <Card.Img
                    className="image rounded-0"
                    variant="top"
                    src={product?.first_photo}
                    loading="lazy"
                  />
                  <Card.Body className="p-2">
                    <div className="card-title">{product?.product_title}</div>
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
            ))
          ) : (
            <Col xs={12} className="empty-product">
              <img
                src="https://storage.googleapis.com/turtleman-primary-bucket/public_images/website_stuff/pikachu.webp"
                alt="No Products Available"
                className="no-products-image"
                loading="lazy"
              />
              <h5>No products found</h5>
              <Button variant="warning" onClick={() => navigate(-1)}>
                Go Back
              </Button>
            </Col>
          )}
        </Row>
      )}

      <Modal
        className="custom-modal"
        show={showFilterModal}
        onHide={() => setShowFilterModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Filters</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="g-3">
              {[
                {
                  label: "Sizes",
                  options: ["S", "M", "L", "XL", "XXL"],
                  type: "sizes",
                },
                {
                  label: "Cloth Fit",
                  options: ["REGULAR", "OVERSIZED"],
                  type: "cloth_fit",
                },
                {
                  label: "Gender",
                  options: ["MALE", "FEMALE", "UNISEX"],
                  type: "gender",
                },
                // {
                //   label: "Product Style",
                //   options: ["ROUNDNECK", "V-NECK", "OVERSIZED"],
                //   type: "product_style",
                // },
                // {
                //   label: "Color",
                //   options: ["RED", "BLUE", "BLACK", "WHITE"],
                //   type: "color",
                // },
              ].map((filter) => (
                <Col xs={12} md={6} key={filter.type}>
                  <Form.Group>
                    <Form.Label className="d-flex justify-content-between align-items-center">
                      {filter.label}
                      {tempFilters[filter.type]?.length > 0 && (
                        <Button
                          variant="link"
                          className="p-0 clear-button"
                          onClick={() => handleClearFilter(filter.type)}
                        >
                          Clear
                        </Button>
                      )}
                    </Form.Label>
                    <div className="d-flex flex-wrap">
                      {filter.options.map((option) => (
                        <div
                          key={option}
                          className={`custom-option me-3 ${
                            tempFilters[filter.type].includes(option)
                              ? "selected"
                              : ""
                          }`}
                          onClick={() =>
                            handleFilterChange(filter.type, option)
                          }
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  </Form.Group>
                </Col>
              ))}
              <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label>Price Range</Form.Label>
                  <Slider
                    range
                    min={250}
                    max={750}
                    value={[tempFilters.minPrice, tempFilters.maxPrice]}
                    onChange={handleSliderChange}
                  />
                  <div className="price-range-values d-flex justify-content-between mt-2">
                    <span>{formatIndianCurrency(tempFilters.minPrice)}</span>
                    <span>{formatIndianCurrency(tempFilters.maxPrice)}</span>
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="modal-close-button"
            onClick={() => setShowFilterModal(false)}
          >
            Close
          </button>
          <button className="modal-remove-button" onClick={handleRemoveAllFilters}>
            Remove Filters
          </button>
          <button className="modal-apply-button" onClick={handleFilterApply}>
            Apply Filters
          </button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ProductsPage;
