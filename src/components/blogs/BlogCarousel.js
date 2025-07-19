import React, { useState, useEffect } from "react";
import { Carousel, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../axiosInstance";
import "./BlogCarousel.scss";

const BlogCarousel = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axiosInstance.get("/blog/blogs");
        setBlogs(response.data || []); 
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="loading-spinner">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!blogs || blogs.length === 0) {
    return null;
  }

  return (
    <div className="blog-section">
      <h6
        className="mb-3 mt-3"
        style={{ fontWeight: "600", textAlign: "center" }}
      >
        BLOG PICKS: CHECK ‘EM OUT!
      </h6>
      <div className="blog-carousel">
        <Carousel
          indicators={true}
          controls={false}
          interval={5000}
          fade={true}
        >
          {blogs.map((blog, index) => (
            <Carousel.Item key={blog.id} className="carousel-item">
              <Link to={`/blogs/${blog.id}`} className="carousel-card">
                <h5 className="carousel-title">{blog.title}</h5>
              </Link>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default BlogCarousel;
