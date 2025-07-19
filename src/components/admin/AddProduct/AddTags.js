import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { axiosInstance } from "../../../axiosInstance";
import "./AddTags.scss";

const AddTags = ({ productId }) => {
  const [tags, setTags] = useState([""]);

  const handleTagChange = (index, value) => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
  };

  const handleAddTag = () => {
    setTags([...tags, ""]);
  };

  const handleRemoveTag = (index) => {
    const newTags = tags.filter((_, i) => i !== index);
    setTags(newTags);
  };

  const handleSaveTags = async () => {
    // Convert all tags to uppercase
    const uppercaseTags = tags.map((tag) => tag.toUpperCase());

    try {
      const response = await axiosInstance.post(
        `/product/products/${productId}/tags`,
        {
          tags: uppercaseTags,
        }
      );
    } catch (error) {
      console.error("Failed to save tags:", error);
    }
  };

  return (
    <div className="add-tags-container">
      <h3>Add Tags</h3>
      {tags.map((tag, index) => (
        <Form.Group as={Row} key={index} controlId={`tag-${index}`}>
          <Col sm={8}>
            <Form.Control
              type="text"
              value={tag}
              onChange={(e) => handleTagChange(index, e.target.value)}
            />
          </Col>
          <Col sm={4}>
            <Button variant="danger" onClick={() => handleRemoveTag(index)}>
              Remove
            </Button>
          </Col>
        </Form.Group>
      ))}
      <Button variant="primary" onClick={handleAddTag}>
        Add Tag
      </Button>
      <Button variant="success" onClick={handleSaveTags} className="ml-2">
        Save Tags
      </Button>
    </div>
  );
};

export default AddTags;
