import React, { useState, useEffect } from "react";
import FeaturedCategories from "../components/home/FeaturedCategories";
import FeaturedProducts from "../components/home/FeaturedProducts";
import PopularRightNow from "../components/home/PopularRightNow";
import useDeviceType from "../hooks/useDeviceType";
import "./HomePage.scss";
import NewArrivalsHome from "../components/home/NewArrivalsHome";
import { axiosInstance } from "../axiosInstance";
import BlogCarousel from "../components/blogs/BlogCarousel";

const HomePage = () => {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const deviceType = useDeviceType();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await axiosInstance.get(`/home/home-product-details`);
        setHomeData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching home data", error);
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return <div className="loading-container"></div>;
  }

  return (
    <>
      {homeData ? (
        <>
          {homeData.featured_products ? (
            <FeaturedProducts products={homeData.featured_products} />
          ) : (
            <div>Featured Products not present</div>
          )}

          {homeData.featured_categories ? (
            <FeaturedCategories categories={homeData.featured_categories} />
          ) : (
            <div>Featured Categories not present</div>
          )}

          {homeData.new_arrivals ? (
            <NewArrivalsHome products={homeData.new_arrivals} />
          ) : (
            <div>New Arrivals Not present</div>
          )}

          {homeData.popular_right_now ? (
            <PopularRightNow products={homeData.popular_right_now} />
          ) : (
            <div>Popular Right Now not present</div>
          )}

          <BlogCarousel />

          {/* {homeData.shop_by_occasion ? (
            <ShopByOccasion occasions={homeData.shop_by_occasion} />
          ) : (
            <div>Shop By Occasion not present</div>
          )} */}
        </>
      ) : (
        <img
          style={{ height: "100%", width: "100%" }}
          src={
            deviceType === "mobile"
              ? "https://storage.googleapis.com/turtleman-primary-bucket/public_images/notFoundImages/home-m.webp"
              : "https://storage.googleapis.com/turtleman-primary-bucket/public_images/notFoundImages/home-d.webp"
          }
          alt="Data not found"
          loading="lazy"
        />
      )}
    </>
  );
};

export default HomePage;
