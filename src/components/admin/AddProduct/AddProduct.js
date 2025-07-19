import React, { useState } from "react";
import { Form, Button, Row, Col, Alert, Spinner } from "react-bootstrap";
import { axiosInstance } from "../../../axiosInstance";
import AddTags from "./AddTags";
import AddDesigns from "./AddDesigns";
import "./AddProduct.scss";
import AddSizes from "./AddSizes";
import AddVariants from "./AddVariants";

const AddProduct = () => {
  const [productData, setProductData] = useState({
    product_title: "",
    product_price: "",
    product_selling_price: "",
    product_description: "",
    product_category: "",
    gender: "",
    photos_of_product: [],
    product_availability: true,
    cloth_fit: "",
    stock_availability: 0,
    detailed_description: {
      material: "",
      manufacturer_details: "",
      laundry_tags: "",
      product_specs: "",
    },
    product_sku: "",
    color: "",
    product_name: "",
    product_style: [], // Added product_style
  });

  const [imageUrl, setImageUrl] = useState("");
  const [style, setStyle] = useState(""); // Added state for style
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [productId, setProductId] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle detailed description changes
  const handleDetailedDescriptionChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      detailed_description: {
        ...prevData.detailed_description,
        [name]: value,
      },
    }));
  };

  // Handle image URL input changes
  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
  };

  // Add image URL to photos_of_product array
  const handleAddImageUrl = () => {
    if (imageUrl) {
      setProductData((prevData) => ({
        ...prevData,
        photos_of_product: [...prevData.photos_of_product, imageUrl],
      }));
      setImageUrl(""); // Clear the input field after adding
    }
  };

  // Remove image URL from photos_of_product array
  const handleRemoveImageUrl = (index) => {
    setProductData((prevData) => ({
      ...prevData,
      photos_of_product: prevData.photos_of_product.filter(
        (url, i) => i !== index
      ),
    }));
  };

  // Add style to product_style array
  const handleAddStyle = () => {
    if (style) {
      setProductData((prevData) => ({
        ...prevData,
        product_style: [...prevData.product_style, style],
      }));
      setStyle(""); // Clear the input field after adding
    }
  };

  // Remove style from product_style array
  const handleRemoveStyle = (index) => {
    setProductData((prevData) => ({
      ...prevData,
      product_style: prevData.product_style.filter((s, i) => i !== index),
    }));
  };

  // Validate form inputs
  const validateForm = () => {
    const {
      product_title,
      product_price,
      product_description,
      product_category,
      gender,
    } = productData;

    return (
      product_title &&
      product_price &&
      product_description &&
      product_category &&
      gender
    );
  };

  // Save new product
  const handleSaveProduct = async () => {
    if (!validateForm()) {
      setMessage("Please fill in all required fields.");
      setMessageType("danger");
      return;
    }

    setLoading(true);

    const formattedData = {
      ...productData,
      product_title: productData.product_title.toUpperCase(),
      product_category: productData.product_category.toUpperCase(),
      gender: productData.gender.toUpperCase(),
      cloth_fit: productData.cloth_fit.toUpperCase(),
      detailed_description: {
        ...productData.detailed_description,
        material: productData.detailed_description.material.toUpperCase(),
        manufacturer_details:
          productData.detailed_description.manufacturer_details.toUpperCase(),
        laundry_tags:
          productData.detailed_description.laundry_tags.toUpperCase(),
        product_specs:
          productData.detailed_description.product_specs.toUpperCase(),
      },
      product_sku: productData.product_sku.toUpperCase(),
      color: productData.color.toUpperCase(),
      product_style: productData.product_style.map((style) =>
        style.toUpperCase()
      ), // Convert product_style to uppercase
    };

    try {
      const response = await axiosInstance.post(
        `/product/products`,
        formattedData
      );
      const savedProductId = response.data.productId;
      setProductId(savedProductId);
      setMessage("Product saved successfully!");
      setMessageType("success");
      setEditMode(false);

    } catch (error) {
      setMessage("Failed to save product. Please try again.");
      setMessageType("danger");
    } finally {
      setLoading(false); // Stop loading animation
    }
  };

  // Edit product details
  const handleEditProduct = () => {
    setEditMode(true);
  };

  // Update existing product
  const handleUpdateProduct = async () => {
    if (!validateForm()) {
      setMessage("Please fill in all required fields.");
      setMessageType("danger");
      return;
    }

    setLoading(true); // Start loading animation

    // Convert specified fields to uppercase
    const formattedData = {
      ...productData,
      product_title: productData.product_title.toUpperCase(),
      product_category: productData.product_category.toUpperCase(),
      gender: productData.gender.toUpperCase(),
      cloth_fit: productData.cloth_fit.toUpperCase(),
      detailed_description: {
        ...productData.detailed_description,
        material: productData.detailed_description.material.toUpperCase(),
        manufacturer_details:
          productData.detailed_description.manufacturer_details.toUpperCase(),
        laundry_tags:
          productData.detailed_description.laundry_tags.toUpperCase(),
        product_specs:
          productData.detailed_description.product_specs.toUpperCase(),
      },
      product_sku: productData.product_sku.toUpperCase(),
      color: productData.color.toUpperCase(),
      product_style: productData.product_style.map((style) =>
        style.toUpperCase()
      ), // Convert product_style to uppercase
    };

    try {
      await axiosInstance.put(
        `/product/products/${productId}`,
        formattedData
      );
      setMessage("Product updated successfully!");
      setMessageType("success");
      setEditMode(false);
    } catch (error) {
      setMessage("Failed to update product. Please try again.");
      setMessageType("danger");
    } finally {
      setLoading(false); // Stop loading animation
    }
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setEditMode(false);
    setMessage("");
  };

  // Reset form after adding product
  const handleAddNewProduct = () => {
    setProductData({
      product_title: "",
      product_price: "",
      product_selling_price: "",
      product_description: "",
      product_category: "",
      gender: "",
      photos_of_product: [],
      product_availability: true,
      cloth_fit: "",
      stock_availability: 0,
      detailed_description: {
        material: "",
        manufacturer_details: "",
        laundry_tags: "",
        product_specs: "",
      },
      product_sku: "",
      color: "",
      product_name: "",
      product_style: [], // Reset product_style
    });
    setProductId(null);
    setMessage("");
    setEditMode(true);
  };

  return (
    <div className="add-product-container">
      <Form className="add-product-form">
        {message && <Alert variant={messageType}>{message}</Alert>}
        <Form.Group controlId="productTitle">
          <Form.Label>Product Title *</Form.Label>
          <Form.Control
            type="text"
            name="product_title"
            value={productData.product_title}
            onChange={handleInputChange}
            disabled={!editMode && productId}
          />
        </Form.Group>
        <Form.Group controlId="productName">
          <Form.Label>Product Name *</Form.Label>
          <Form.Control
            type="text"
            name="product_name"
            value={productData.product_name}
            onChange={handleInputChange}
            disabled={!editMode && productId}
          />
        </Form.Group>
        <Form.Group controlId="color">
          <Form.Label>Color *</Form.Label>
          <Form.Control
            type="text"
            name="color"
            value={productData.color}
            onChange={handleInputChange}
            disabled={!editMode && productId}
          />
        </Form.Group>
        <Form.Group controlId="productSku">
          <Form.Label>Product SKU *</Form.Label>
          <Form.Control
            type="text"
            name="product_sku"
            value={productData.product_sku}
            onChange={handleInputChange}
            disabled={!editMode && productId}
          />
        </Form.Group>

        <Form.Group controlId="productPrice">
          <Form.Label>Product Price *</Form.Label>
          <Form.Control
            type="number"
            name="product_price"
            value={productData.product_price}
            onChange={handleInputChange}
            disabled={!editMode && productId}
          />
        </Form.Group>
        <Form.Group controlId="productSellingPrice">
          <Form.Label>Product Selling Price</Form.Label>
          <Form.Control
            type="number"
            name="product_selling_price"
            value={productData.product_selling_price}
            onChange={handleInputChange}
            disabled={!editMode && productId}
          />
        </Form.Group>
        <Form.Group controlId="productDescription">
          <Form.Label>Product Description *</Form.Label>
          <Form.Control
            as="textarea"
            name="product_description"
            value={productData.product_description}
            onChange={handleInputChange}
            disabled={!editMode && productId}
          />
        </Form.Group>
        <Row>
          <Col>
            <Form.Group controlId="productCategory">
              <Form.Label>Product Category *</Form.Label>
              <Form.Control
                as="select"
                name="product_category"
                value={productData.product_category}
                onChange={handleInputChange}
                disabled={!editMode && productId}
              >
                <option value="">Select Category</option>
                <option value="TSHIRT">T-SHIRT</option>
                <option value="SWEATSHIRT">SWEATSHIRT</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="gender">
              <Form.Label>Gender *</Form.Label>
              <Form.Control
                as="select"
                name="gender"
                value={productData.gender}
                onChange={handleInputChange}
                disabled={!editMode && productId}
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="UNISEX">Unisex</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group controlId="productAvailability">
              <Form.Label>Product Availability</Form.Label>
              <Form.Check
                type="radio"
                label="Available"
                name="product_availability"
                value={true}
                checked={productData.product_availability === true}
                onChange={handleInputChange}
                disabled={!editMode && productId}
              />
              <Form.Check
                type="radio"
                label="Unavailable"
                name="product_availability"
                value={false}
                checked={productData.product_availability === false}
                onChange={handleInputChange}
                disabled={!editMode && productId}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="clothFit">
              <Form.Label>Cloth Fit</Form.Label>
              <Form.Control
                as="select"
                name="cloth_fit"
                value={productData.cloth_fit}
                onChange={handleInputChange}
                disabled={!editMode && productId}
              >
                <option value="">Select Fit</option>
                <option value="Regular">Regular</option>
                <option value="Slim">Slim</option>
                <option value="Oversized">Oversized</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <Form.Group controlId="stockAvailability">
          <Form.Label>Stock Availability</Form.Label>
          <Form.Control
            type="number"
            name="stock_availability"
            value={productData.stock_availability}
            onChange={handleInputChange}
            disabled
          />
        </Form.Group>

        <Form.Group controlId="photosOfProduct">
          <Form.Label>Photos of Product</Form.Label>
          <Row>
            <Col xs={8}>
              <Form.Control
                type="text"
                value={imageUrl}
                onChange={handleImageUrlChange}
                placeholder="Enter image URL"
                disabled={!editMode && productId}
              />
            </Col>
            <Col xs={4}>
              <Button
                onClick={handleAddImageUrl}
                disabled={!editMode && productId}
              >
                Add Image
              </Button>
            </Col>
          </Row>
          <div className="image-preview">
            {productData.photos_of_product.map((url, index) => (
              <div key={index} className="image-thumbnail">
                <img src={url} alt={`Product ${index}`} loading="lazy" />
                {editMode && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveImageUrl(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Form.Group>

        <Form.Group controlId="productStyles">
          <Form.Label>Product Styles</Form.Label>
          <Row>
            <Col xs={8}>
              <Form.Control
                type="text"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                placeholder="Enter product style"
                disabled={!editMode && productId}
              />
            </Col>
            <Col xs={4}>
              <Button
                onClick={handleAddStyle}
                disabled={!editMode && productId}
              >
                Add Style
              </Button>
            </Col>
          </Row>
          <div className="style-preview">
            {productData.product_style.map((s, index) => (
              <div key={index} className="style-thumbnail">
                {s}
                {editMode && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveStyle(index)}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Form.Group>

        <Form.Group controlId="detailedDescription">
          <Form.Label>Detailed Description</Form.Label>
          <Form.Control
            as="textarea"
            name="material"
            value={productData.detailed_description.material}
            onChange={handleDetailedDescriptionChange}
            placeholder="Material"
            disabled={!editMode && productId}
          />
          <Form.Control
            as="textarea"
            name="manufacturer_details"
            value={productData.detailed_description.manufacturer_details}
            onChange={handleDetailedDescriptionChange}
            placeholder="Manufacturer Details"
            disabled={!editMode && productId}
          />
          <Form.Control
            as="textarea"
            name="laundry_tags"
            value={productData.detailed_description.laundry_tags}
            onChange={handleDetailedDescriptionChange}
            placeholder="Laundry Tags"
            disabled={!editMode && productId}
          />
          <Form.Control
            as="textarea"
            name="product_specs"
            value={productData.detailed_description.product_specs}
            onChange={handleDetailedDescriptionChange}
            placeholder="Product Specs"
            disabled={!editMode && productId}
          />
        </Form.Group>

        {loading ? (
          <Spinner animation="border" role="status">
            <span className="sr-only"></span>
          </Spinner>
        ) : productId ? (
          <div>
            {!editMode ? (
              <Button variant="primary" onClick={handleEditProduct}>
                Edit
              </Button>
            ) : (
              <>
                <Button variant="secondary" onClick={handleCancelEdit}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleUpdateProduct}>
                  Save
                </Button>
              </>
            )}
          </div>
        ) : (
          <Button variant="primary" onClick={handleSaveProduct}>
            Save
          </Button>
        )}

        {productId && (
          <Button variant="success" onClick={handleAddNewProduct}>
            Add New Product
          </Button>
        )}
      </Form>

      {productId && !editMode && (
        <>
          <AddTags productId={productId} />
          <AddDesigns productId={productId} />
          <AddSizes productId={productId} />
          {/* <AddVariants productId={productId} /> */}
        </>
      )}
    </div>
  );
};

export default AddProduct;
