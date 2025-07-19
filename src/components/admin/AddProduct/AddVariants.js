import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { axiosInstance } from "../../../axiosInstance";

const AddVariants = ({ productId }) => {
  const [variants, setVariants] = useState([{ type: "", value: "" }]);

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const handleAddVariant = () => {
    setVariants([...variants, { type: "", value: "" }]);
  };

  const handleRemoveVariant = (index) => {
    const newVariants = variants.filter((_, i) => i !== index);
    setVariants(newVariants);
  };

  const handleSaveVariants = async () => {
    try {
      const response = await axiosInstance.post(
        `/product/products/${productId}/variants`,
        { variants }
      );
    } catch (error) {
      console.error("Failed to save variants:", error);
    }
  };

  return (
    <div className="add-variant-container">
      <h3>Add Variants</h3>
      {variants.map((variant, index) => (
        <Row key={index}>
          <Col sm={5}>
            <Form.Group controlId={`variantType-${index}`}>
              <Form.Label>Variant Type</Form.Label>
              <Form.Control
                type="text"
                value={variant.type}
                onChange={(e) =>
                  handleVariantChange(index, "type", e.target.value)
                }
              />
            </Form.Group>
          </Col>
          <Col sm={5}>
            <Form.Group controlId={`variantValue-${index}`}>
              <Form.Label>Variant Value</Form.Label>
              <Form.Control
                type="text"
                value={variant.value}
                onChange={(e) =>
                  handleVariantChange(index, "value", e.target.value)
                }
              />
            </Form.Group>
          </Col>
          <Col sm={2}>
            <Button variant="danger" onClick={() => handleRemoveVariant(index)}>
              Remove
            </Button>
          </Col>
        </Row>
      ))}
      <Button variant="primary" onClick={handleAddVariant}>
        Add More
      </Button>
      <Button variant="success" onClick={handleSaveVariants} className="ml-2">
        Save Variants
      </Button>
    </div>
  );
};

export default AddVariants;
