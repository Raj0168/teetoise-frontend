import React, { useState, useEffect } from "react";
import { Card, Container, Row, Col, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../axiosInstance";
import "./BlogPage.scss";

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axiosInstance.get("/blog/blogs");
        setBlogs(response.data);
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

  return (
    <div className="blog-page">
      <Container>
        <Row>
          {blogs.map((blog) => (
            <Col xs={12} sm={6} md={4} lg={3} key={blog.id}>
              <Card className="mb-4">
                <Card.Body>
                  <Link to={`/blogs/${blog.id}`} className="card-title">
                    {blog.title}
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default BlogPage;
