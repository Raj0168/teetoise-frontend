import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { axiosInstance } from "../../../axiosInstance";

const AddSizes = ({ productId }) => {
  const [sizes, setSizes] = useState([{ size: "", available_quantity: "" }]);

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...sizes];
    newSizes[index][field] = value;
    setSizes(newSizes);
  };

  const handleAddSize = () => {
    setSizes([...sizes, { size: "", available_quantity: "" }]);
  };

  const handleRemoveSize = (index) => {
    const newSizes = sizes.filter((_, i) => i !== index);
    setSizes(newSizes);
  };

  const handleSaveSizes = async () => {
    // Convert the 'size' field to uppercase
    const uppercaseSizes = sizes.map((size) => ({
      size: size.size.toUpperCase(),
      available_quantity: size.available_quantity,
    }));

    try {
      const response = await axiosInstance.post(
        `/product/products/${productId}/sizes`,
        { sizes: uppercaseSizes }
      );
    } catch (error) {
      console.error("Failed to save sizes:", error);
    }
  };

  return (
    <div className="add-size-container">
      <h3>Add Sizes and Quantities</h3>
      {sizes.map((size, index) => (
        <Row key={index}>
          <Col sm={5}>
            <Form.Group controlId={`size-${index}`}>
              <Form.Label>Size</Form.Label>
              <Form.Control
                type="text"
                value={size.size}
                onChange={(e) =>
                  handleSizeChange(index, "size", e.target.value)
                }
              />
            </Form.Group>
          </Col>
          <Col sm={5}>
            <Form.Group controlId={`quantity-${index}`}>
              <Form.Label>Available Quantity</Form.Label>
              <Form.Control
                type="number"
                value={size.available_quantity}
                onChange={(e) =>
                  handleSizeChange(index, "available_quantity", e.target.value)
                }
              />
            </Form.Group>
          </Col>
          <Col sm={2}>
            <Button variant="danger" onClick={() => handleRemoveSize(index)}>
              Remove
            </Button>
          </Col>
        </Row>
      ))}
      <Button variant="primary" onClick={handleAddSize}>
        Add More
      </Button>
      <Button variant="success" onClick={handleSaveSizes} className="ml-2">
        Save Sizes
      </Button>
    </div>
  );
};

export default AddSizes;
