import React from "react";
import Slider from "react-slick";
import { useMediaQuery } from "react-responsive";
import Carousel from "react-bootstrap/Carousel";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./FeaturedProducts.scss";

const NextArrow = ({ onClick }) => {
  return <div className="slick-arrow slick-next" onClick={onClick}></div>;
};

const PrevArrow = ({ onClick }) => {
  return <div className="slick-arrow slick-prev" onClick={onClick}></div>;
};

const NewArrivalsHome = ({ products }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const navigate = useNavigate();

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    swipeToSlide: true,
    draggable: true,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <>
      <h6
        className="mb-3 mt-2"
        style={{ fontWeight: "600", textAlign: "center" }}
      >
        NEW ARRIVALS
      </h6>
      {isMobile ? (
        <Carousel
          className="featured-products"
          indicators={true}
          controls={false}
          interval={3000}
        >
          {products.map((product) => (
            <Carousel.Item
              key={product.id}
              onClick={() => handleProductClick(product.product_name)}
            >
              <div className="product-slide">
                <img
                  src={product?.photo}
                  alt={product.product_title}
                  className="d-block w-100"
                  loading="lazy"
                />
                <Carousel.Caption>
                  <h3 className="slider-caption">{product.product_title}</h3>
                </Carousel.Caption>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      ) : (
        <div className="slider-wrapper">
          <Slider {...sliderSettings} className="featured-products-slider">
            {products.map((product) => (
              <div
                key={product.id}
                className="product-slide"
                onClick={() => handleProductClick(product.product_name)}
              >
                <img
                  src={product?.photo}
                  alt={product.product_title}
                  className="d-block w-100"
                  loading="lazy"
                />
                <div className="slider-caption">
                  <h3>{product.product_title}</h3>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      )}
    </>
  );
};

export default NewArrivalsHome;
