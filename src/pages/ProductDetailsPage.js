import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Tooltip,
  OverlayTrigger,
  Image,
  Modal,
  Table,
  Spinner,
} from "react-bootstrap";
import Slider from "react-slick";
import { axiosInstance } from "../axiosInstance";
import colorCodes from "../assets/styles/colorCodes";
import { formatIndianCurrency } from "../utils/currencyFormatter";
import { toast } from "react-toastify";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import "./ProductDetailsPage.scss";
import ShareButton from "../components/commons/ShareButton";
import SizeChartModal from "../components/product/SizeChartModal";

const PrevArrow = ({ onClick }) => (
  <button type="button" className="slick-arrow slick-prev" onClick={onClick}>
    &#8249;
  </button>
);

const NextArrow = ({ onClick }) => (
  <button type="button" className="slick-arrow slick-next" onClick={onClick}>
    &#8250;
  </button>
);

const ProductDetailsPage = () => {
  const { productId: paramProductId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const { user } = useSelector((state) => state.user);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [clothFit, setClothFit] = useState("OVERSIZED");
  const [showDetails, setShowDetails] = useState(false);
  const [showSpecs, setShowSpecs] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const similarSliderRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setPageLoading(true);
      try {
        const response = await axiosInstance.get(
          `/product/products/${paramProductId}`
        );
        setProduct(response.data);
        setMainImage(response.data?.photos_of_product?.[0]);

        if (response.data?.product_style) {
          const styleParams = response.data.product_style
            .map((style) => `styles[]=${style}`)
            .join("&");
          const similarResponse = await axiosInstance.get(
            `/product/related-products?${styleParams}`
          );
          setSimilarProducts(similarResponse.data);
        }
      } catch (error) {
        console.error("Error fetching product details", error);
        toast.error("Failed to load product details.");
      } finally {
        setPageLoading(false);
      }
    };

    fetchProduct();
  }, [paramProductId]);

  const handleAddToWishlist = async () => {
    if (!user) {
      toast.info("Please login to access Wishlist.");
      navigate("/auth/login");
    } else {
      setIsWishlistLoading(true);
      try {
        const response = await axiosInstance.post("/wishlist", {
          productId: product?.id,
        });
        toast.success(
          response?.data?.message ||
            `${product?.product_title} added to wishlist!`
        );
      } catch (error) {
        console.error("Error adding to wishlist", error);
        toast.error(
          error.response?.data?.message || "Failed to add to wishlist"
        );
      } finally {
        setIsWishlistLoading(false);
      }
    }
  };

  const handleSizeChange = (e, fit) => {
    setSelectedSize(e.target.value);
    setClothFit(fit);
  };

  const handleShowSizeChart = (fit) => {
    setClothFit(fit);
    setShowSizeChart(true);
  };

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.info("Please login to access Cart.");
      navigate("/auth/login");
    } else {
      if (selectedSize) {
        setIsCartLoading(true);
        try {
          const response = await axiosInstance.post("/cart", {
            product_id: product?.id,
            size: selectedSize,
            quantity: quantity,
            variant: "variant",
          });
          toast.success(
            response?.data?.message ||
              `Added ${product?.product_title} (Size: ${selectedSize}, Quantity: ${quantity}) to cart!`
          );
          localStorage.setItem("isCart", true);
        } catch (error) {
          console.error("Error adding to cart", error);
          toast.error(error.response?.data?.message || "Failed to add to cart");
        } finally {
          setIsCartLoading(false);
        }
      } else {
        toast.warning("Please select a size before adding to cart.");
      }
    }
  };

  const handleColorClick = (productName) => {
    navigate(`/product/${productName}`);
  };

  if (pageLoading) {
    return (
      <div
        className="loading-page d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden"></span>
        </Spinner>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-message text-center mt-5">
        <h4>Product not found.</h4>
        <Button onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    );
  }

  const characterLimit = 100;

  const toggleDescription = () => {
    setIsExpanded(!isExpanded);
  };

  const truncateText = (text, limit) => {
    if (text.length <= limit) return text;
    return text.slice(0, limit) + "...";
  };

  const description = product?.product_description || "";

  const sliderSettings = {
    dots: false,
    infinite: product?.photos_of_product?.length > 4,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    arrows: product?.photos_of_product?.length > 4,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
        },
      },
    ],
  };

  const allSizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const similarProductsSliderSettings = {
    dots: false,
    infinite: similarProducts.length > 6,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 2,
    arrows: similarProducts?.length > 4,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Container className="product-details-page">
      <Row>
        <Col xs={12} md={6} className="main-image-container">
          {mainImage && (
            <div className="main-image-wrapper position-relative">
              <button
                type="button"
                className="image-nav-button prev-button"
                onClick={() => {
                  const currentIndex =
                    product.photos_of_product.indexOf(mainImage);
                  const prevIndex =
                    (currentIndex - 1 + product.photos_of_product.length) %
                    product.photos_of_product.length;
                  setMainImage(product.photos_of_product[prevIndex]);
                }}
              >
                &#8249;
              </button>
              <Image src={mainImage} className="main-image" fluid />
              <button
                type="button"
                className="image-nav-button next-button"
                onClick={() => {
                  const currentIndex =
                    product.photos_of_product.indexOf(mainImage);
                  const nextIndex =
                    (currentIndex + 1) % product.photos_of_product.length;
                  setMainImage(product.photos_of_product[nextIndex]);
                }}
              >
                &#8250;
              </button>
            </div>
          )}

          {product?.photos_of_product?.length > 0 && (
            <Slider {...sliderSettings} className="carousel-images mt-3">
              {product.photos_of_product.map((photo, index) => (
                <div key={index} className="carousel-slide">
                  <Image
                    src={photo}
                    className="carousel-thumbnail"
                    onClick={() => setMainImage(photo)}
                    style={{
                      cursor: "pointer",
                      border:
                        photo === mainImage ? "2px solid #F8D32A" : "none",
                    }}
                  />
                </div>
              ))}
            </Slider>
          )}
        </Col>
        <Col xs={12} md={6}>
          <h2 className="product-title">{product?.product_title}</h2>

          <p className="mrp mb-1">
            {formatIndianCurrency(product?.product_selling_price)}
            <span className="actual-price">
              {formatIndianCurrency(product?.product_price)}
            </span>
            {product?.available_discount && (
              <>
                <span className="discount-text">
                  ({parseInt(product.available_discount, 10)}% off)
                </span>
              </>
            )}
            <ShareButton />
          </p>
          <p style={{ fontSize: "12px" }}>
            GENDER: {product?.gender?.toUpperCase()}
          </p>
          <div>
            <p style={{ fontSize: "14px" }}>
              {isExpanded
                ? description
                : truncateText(description, characterLimit)}
              {description.length > characterLimit && (
                <span
                  variant="link"
                  onClick={toggleDescription}
                  style={{ color: "#7f8c8d", marginLeft: "1rem" }}
                >
                  {isExpanded ? "Read Less" : "Read More"}
                </span>
              )}
            </p>
          </div>

          {product?.available_colors?.length > 0 && (
            <div className="color-section mt-3">
              <h5>Available Colors</h5>
              <div className="color-circles d-flex flex-wrap">
                {product.available_colors.map((color) => (
                  <div
                    key={color.productId}
                    className="color-item me-2 mb-2 text-center"
                    onClick={() => handleColorClick(color?.productName)}
                    style={{ cursor: "pointer" }}
                  >
                    <div
                      className="color-circle mb-1"
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        backgroundColor:
                          colorCodes[color.productColor] || "#ccc",
                        margin: "0 auto",
                        border:
                          paramProductId === color.productId
                            ? "2px solid #007bff"
                            : "1px solid #ccc",
                      }}
                    ></div>
                    <span className="color-name d-block">
                      {color.productColor}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className=" w-100">
            {product?.sizes && (
              <div className="size-section">
                <p style={{ fontSize: "12px" }}>
                  FIT: {product?.cloth_fit?.toUpperCase()}
                </p>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5>Select Size</h5>
                  <OverlayTrigger
                    placement="top"
                    className="tooltip"
                    overlay={<Tooltip>Get your perfect fit!</Tooltip>}
                  >
                    <button
                      type="button"
                      className="wishlist-button style-button"
                      onClick={() => handleShowSizeChart(product?.cloth_fit)}
                    >
                      Show Size Chart
                    </button>
                  </OverlayTrigger>
                </div>

                <div className="size-circles d-flex flex-wrap">
                  {allSizes.map((size) => (
                    <div
                      key={size}
                      className={`size-item me-2 mb-2 ${
                        selectedSize === size ? "selected" : ""
                      } ${product.sizes[size] ? "" : "disabled"}`}
                      onClick={() =>
                        product.sizes[size] &&
                        handleSizeChange(
                          { target: { value: size } },
                          product?.cloth_fit
                        )
                      }
                      style={{
                        textAlign: "center",
                      }}
                    >
                      <div className="size-circle d-flex justify-content-center align-items-center">
                        <span className="size-name">{size}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-3">
            <h5>Quantity</h5>
            <Form.Select
              value={quantity}
              onChange={handleQuantityChange}
              className="form-control w-25"
            >
              {[...Array(5).keys()].map((i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </Form.Select>
          </div>
          <div className="bottom-always">
            <button
              type="button"
              className="wishlist-button w-100"
              onClick={handleAddToWishlist}
              disabled={isWishlistLoading}
            >
              {isWishlistLoading ? "Adding..." : "Add to Wishlist"}
            </button>

            <button
              type="button"
              className="cart-button w-100"
              onClick={handleAddToCart}
              disabled={isCartLoading}
            >
              {isCartLoading ? "Adding..." : "Add to Cart"}
            </button>
          </div>

          <div className="product-details mt-3">
            {/* Product Details Toggle */}
            <div
              className="toggle-header d-flex align-items-center"
              onClick={() => setShowDetails(!showDetails)}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                backgroundColor: "#f8f9fa",
                border: "1px solid #dee2e6",
                borderRadius: "5px",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <h6 className="m-0">Fabric Facts</h6>
              {showDetails ? (
                <FaChevronUp className="ms-auto" />
              ) : (
                <FaChevronDown className="ms-auto" />
              )}
            </div>

            {showDetails && (
              <Table responsive bordered hover>
                <tbody>
                  <tr>
                    <td>
                      <strong>Material</strong>
                    </td>
                    <td>
                      {product?.detailed_description?.material.toUpperCase()}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Care Instructions</strong>
                    </td>
                    <td>
                      <ul>
                        {product?.detailed_description?.laundry_tags
                          .toUpperCase()
                          ?.split("\n")
                          .map((tag, index) => (
                            <li key={index}>{tag}</li>
                          ))}
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Manufacturer Details</strong>
                    </td>
                    <td>
                      {product?.detailed_description?.manufacturer_details.toUpperCase()}
                      <img
                        src="https://storage.googleapis.com/turtleman-primary-bucket/public_images/website_stuff/india-flag.png"
                        alt="India"
                        style={{
                          marginLeft: "10px",
                          width: "12px",
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
              </Table>
            )}

            <div
              className="toggle-header d-flex align-items-center mt-3"
              onClick={() => setShowSpecs(!showSpecs)}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                backgroundColor: "#f8f9fa",
                border: "1px solid #dee2e6",
                borderRadius: "5px",
                padding: "10px",
              }}
            >
              <h6 className="m-0">Specs & Perks</h6>
              {showSpecs ? (
                <FaChevronUp className="ms-auto" />
              ) : (
                <FaChevronDown className="ms-auto" />
              )}
            </div>

            {showSpecs && (
              <div className="mt-2">
                <Table responsive bordered hover>
                  <tbody>
                    <tr>
                      <td>
                        <ul>
                          {product?.detailed_description?.product_specs
                            ?.replace(/\*/g, "")
                            ?.toUpperCase()
                            ?.split("\n")
                            .map((tag, index) => (
                              <li key={index}>{tag}</li>
                            ))}
                        </ul>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            )}
          </div>
        </Col>
        <hr />
      </Row>

      {similarProducts.length > 0 && (
        <Row className="similar-products-section">
          <Col>
            <h5 className="mb-2">You may also like</h5>
            <Slider
              {...similarProductsSliderSettings}
              className="carousel-images border-more-section"
            >
              {similarProducts.map((product) => (
                <div key={product.id} className="carousel-slide-more">
                  <Image
                    src={product.first_photo}
                    alt={product.product_title}
                    className="carousel-thumbnail"
                    onClick={() => {
                      navigate(`/product/${product?.product_name}`);
                    }}
                    style={{
                      cursor: "pointer",
                      border: "none",
                      borderRadius: "5px",
                      height: "200px",
                      objectFit: "cover",
                    }}
                  />
                  <div className="text-center mt-2">
                    <div className="card-title">{product.product_title}</div>
                    <div className="mrp-2">
                      {formatIndianCurrency(product.product_selling_price)}
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </Col>
        </Row>
      )}

      <SizeChartModal
        show={showSizeChart}
        onHide={() => setShowSizeChart(false)}
        clothFit={clothFit}
      />
    </Container>
  );
};

export default ProductDetailsPage;
