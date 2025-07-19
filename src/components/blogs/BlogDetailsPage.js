import React, { useState, useEffect } from "react";
import { Container, Card, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../../axiosInstance";
import { MdExpandMore, MdExpandLess } from "react-icons/md";
import "./BlogDetailsPage.scss";

const BlogDetailsPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [openSection, setOpenSection] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axiosInstance.get(`/blog/blogs/${id}`);
        setBlog(response.data);
      } catch (error) {
        console.error("Error fetching blog details:", error);
      }
    };
    fetchBlog();
  }, [id]);

  if (!blog) return <div className="loading-spinner"></div>;

  return (
    <Container className="blog-details-page">
      <Card className="blog-card">
        <Card.Body>
          <Card.Title className="mt-3 mb-4 blog-title">{blog.title}</Card.Title>
          {blog.sections.map((section, index) => (
            <div key={index} className="section mb-4">
              <Button
                className="section-title"
                onClick={() =>
                  setOpenSection(openSection === index ? null : index)
                }
              >
                <span>{section.subtitle}</span>
                {openSection === index ? (
                  <MdExpandLess size="32" />
                ) : (
                  <MdExpandMore size="32" />
                )}
              </Button>
              {openSection === index && (
                <div className="section-content">
                  <p>{section.content}</p>
                </div>
              )}
            </div>
          ))}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BlogDetailsPage;
