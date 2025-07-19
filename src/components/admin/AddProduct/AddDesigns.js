import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { axiosInstance } from "../../../axiosInstance";
import "./AddDesigns.scss";

const AddDesigns = ({ productId }) => {
  const [designs, setDesigns] = useState([
    { design_type: "", design_value: "" },
  ]);

  const handleDesignChange = (index, field, value) => {
    const newDesigns = [...designs];
    newDesigns[index][field] = value;
    setDesigns(newDesigns);
  };

  const handleAddDesign = () => {
    setDesigns([...designs, { design_type: "", design_value: "" }]);
  };

  const handleRemoveDesign = (index) => {
    const newDesigns = designs.filter((_, i) => i !== index);
    setDesigns(newDesigns);
  };

  const handleSaveDesigns = async () => {
    const uppercaseDesigns = designs.map((design) => ({
      design_type: design.design_type.toUpperCase(),
      design_value: design.design_value.toUpperCase(),
    }));

    try {
      const response = await axiosInstance.post(
        `/product/products/${productId}/designs`,
        { designs: uppercaseDesigns }
      );
    } catch (error) {
      console.error("Failed to save designs:", error);
    }
  };

  return (
    <div className="add-design-container">
      <h3>Add Designs</h3>
      {designs.map((design, index) => (
        <Row key={index}>
          <Col sm={5}>
            <Form.Group controlId={`designType-${index}`}>
              <Form.Label>Design Type</Form.Label>
              <Form.Control
                type="text"
                value={design.design_type}
                onChange={(e) =>
                  handleDesignChange(index, "design_type", e.target.value)
                }
              />
            </Form.Group>
          </Col>
          <Col sm={5}>
            <Form.Group controlId={`designValue-${index}`}>
              <Form.Label>Design Value</Form.Label>
              <Form.Control
                type="text"
                value={design.design_value}
                onChange={(e) =>
                  handleDesignChange(index, "design_value", e.target.value)
                }
              />
            </Form.Group>
          </Col>
          <Col sm={2}>
            <Button variant="danger" onClick={() => handleRemoveDesign(index)}>
              Remove
            </Button>
          </Col>
        </Row>
      ))}
      <Button variant="primary" onClick={handleAddDesign}>
        Add More
      </Button>
      <Button variant="success" onClick={handleSaveDesigns} className="ml-2">
        Save Designs
      </Button>
    </div>
  );
};

export default AddDesigns;
