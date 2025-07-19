import React, { useState } from "react";
import {
  Form,
  Button,
  Modal,
  Image,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import { axiosInstance } from "../../axiosInstance";
import AddTags from "./AddProduct/AddTags";
import AddDesigns from "./AddProduct/AddDesigns";
import AddSizes from "./AddProduct/AddSizes";
import AddVariants from "./AddProduct/AddVariants";
import { toast } from "react-toastify";
import "./EditProduct.scss";

const EditProduct = ({ product, onCancel }) => {
  const [editableProduct, setEditableProduct] = useState({
    ...product,
    detailed_description: {
      material: product?.detailed_description?.material || "",
      manufacturer_details:
        product?.detailed_description?.manufacturer_details || "",
      laundry_tags: product?.detailed_description?.laundry_tags || "",
    },
  });
  const [editing, setEditing] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [loading, setLoading] = useState(false); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleDetailedDescriptionChange = (field, value) => {
    setEditableProduct((prevProduct) => ({
      ...prevProduct,
      detailed_description: {
        ...prevProduct.detailed_description,
        [field]: value,
      },
    }));
  };

  const handleImageChange = (e, index) => {
    const { value } = e.target;
    setEditableProduct((prevProduct) => {
      const updatedPhotos = [...prevProduct.photos_of_product];
      updatedPhotos[index] = value;
      return {
        ...prevProduct,
        photos_of_product: updatedPhotos,
      };
    });
  };

  const handleAddImage = () => {
    if (newImageUrl) {
      setEditableProduct((prevProduct) => ({
        ...prevProduct,
        photos_of_product: [...prevProduct.photos_of_product, newImageUrl],
      }));
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (index) => {
    setEditableProduct((prevProduct) => {
      const updatedPhotos = prevProduct.photos_of_product.filter(
        (photo, i) => i !== index
      );
      return {
        ...prevProduct,
        photos_of_product: updatedPhotos,
      };
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        product_title: editableProduct.product_title,
        product_price: parseFloat(editableProduct.product_price),
        product_selling_price: parseFloat(
          editableProduct.product_selling_price
        ),
        available_discount: parseFloat(editableProduct.available_discount),
        product_description: editableProduct.product_description,
        product_category: editableProduct.product_category,
        color: editableProduct.color,
        gender: editableProduct.gender,
        photos_of_product: editableProduct.photos_of_product || [],
        product_style: editableProduct.product_style || [],
        product_availability: editableProduct.product_availability,
        cloth_fit: editableProduct.cloth_fit,
        stock_availability: parseInt(editableProduct.stock_availability, 10),
        detailed_description: editableProduct.detailed_description,
      };

      await axiosInstance.put(
        `/product/products/${editableProduct.id}`,
        payload
      );
      toast.success("Product updated successfully!"); // Success toast
      setEditing(false);
      onCancel(); // Close the modal after saving
    } catch (error) {
      toast.error("Failed to update product."); // Error toast
      console.error("Failed to update product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axiosInstance.delete(`/product/products/${editableProduct.id}`);
      toast.success("Product deleted successfully!"); // Success toast
      onCancel(); // Close the modal after deleting
    } catch (error) {
      toast.error("Failed to delete product."); // Error toast
      console.error("Failed to delete product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show onHide={onCancel}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className="loading-animation">yy</div>
        ) : (
          <Form>
            <Form.Group controlId="productTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="product_title"
                value={editableProduct.product_title}
                onChange={handleInputChange}
                disabled={!editing}
              />
            </Form.Group>

            <Form.Group controlId="productPrice">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="product_price"
                value={editableProduct.product_price}
                onChange={handleInputChange}
                disabled={!editing}
              />
            </Form.Group>

            <Form.Group controlId="productDiscount">
              <Form.Label>Discount</Form.Label>
              <Form.Control
                type="number"
                name="available_discount"
                value={editableProduct.available_discount}
                onChange={handleInputChange}
                disabled={!editing}
              />
            </Form.Group>

            <Form.Group controlId="productMrp">
              <Form.Label>Product MRP</Form.Label>
              <Form.Control
                type="number"
                name="product_selling_price"
                value={editableProduct.product_selling_price}
                onChange={handleInputChange}
                disabled={!editing}
              />
            </Form.Group>

            <Form.Group controlId="productCategory">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                name="product_category"
                value={editableProduct.product_category}
                onChange={handleInputChange}
                disabled={!editing}
              />
            </Form.Group>

            <Form.Group controlId="productColor">
              <Form.Label>Color</Form.Label>
              <Form.Control
                type="text"
                name="color"
                value={editableProduct.color}
                onChange={handleInputChange}
                disabled={!editing}
              />
            </Form.Group>

            <Form.Group controlId="productAvailability">
              <Form.Label>Availability</Form.Label>
              <Form.Check
                type="checkbox"
                name="product_availability"
                checked={editableProduct.product_availability}
                onChange={(e) =>
                  setEditableProduct((prevProduct) => ({
                    ...prevProduct,
                    product_availability: e.target.checked,
                  }))
                }
                disabled={!editing}
              />
            </Form.Group>

            <Form.Group controlId="productStock">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="number"
                name="stock_availability"
                value={editableProduct.stock_availability}
                onChange={handleInputChange}
                disabled
              />
            </Form.Group>

            <Form.Group controlId="productDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="product_description"
                value={editableProduct.product_description}
                onChange={handleInputChange}
                disabled={!editing}
              />
            </Form.Group>

            <Form.Group controlId="productGender">
              <Form.Label>Gender</Form.Label>
              <div>
                {["male", "female", "unisex"].map((g) => (
                  <Form.Check
                    key={g}
                    type="radio"
                    label={g.charAt(0).toUpperCase() + g.slice(1)}
                    name="gender"
                    value={g}
                    checked={editableProduct.gender === g}
                    onChange={handleInputChange}
                    disabled={!editing}
                  />
                ))}
              </div>
            </Form.Group>

            <Form.Group controlId="detailedDescriptionMaterial">
              <Form.Label>Material</Form.Label>
              <Form.Control
                type="text"
                value={editableProduct.detailed_description.material}
                onChange={(e) =>
                  handleDetailedDescriptionChange("material", e.target.value)
                }
                disabled={!editing}
              />
            </Form.Group>

            <Form.Group controlId="detailedDescriptionManufacturer">
              <Form.Label>Manufacturer Details</Form.Label>
              <Form.Control
                type="text"
                value={
                  editableProduct.detailed_description.manufacturer_details
                }
                onChange={(e) =>
                  handleDetailedDescriptionChange(
                    "manufacturer_details",
                    e.target.value
                  )
                }
                disabled={!editing}
              />
            </Form.Group>

            <Form.Group controlId="detailedDescriptionLaundryTags">
              <Form.Label>Laundry Tags</Form.Label>
              <Form.Control
                type="text"
                value={editableProduct.detailed_description.laundry_tags}
                onChange={(e) =>
                  handleDetailedDescriptionChange(
                    "laundry_tags",
                    e.target.value
                  )
                }
                disabled={!editing}
              />
            </Form.Group>

            <Form.Group controlId="productImages">
              <Form.Label>Images</Form.Label>
              {editableProduct.photos_of_product?.length > 0 && (
                <ListGroup>
                  {editableProduct.photos_of_product.map((url, index) => (
                    <ListGroup.Item key={index}>
                      <div className="d-flex justify-content-between align-items-center">
                        <Image
                          src={url}
                          rounded
                          style={{ width: "100px", height: "auto" }}
                        />
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                        {editing && (
                          <>
                            <Form.Control
                              type="text"
                              value={url}
                              onChange={(e) => handleImageChange(e, index)}
                              placeholder="Update image URL"
                            />
                            <Button
                              variant="danger"
                              onClick={() => handleRemoveImage(index)}
                            >
                              Remove
                            </Button>
                          </>
                        )}
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
              {editing && (
                <>
                  <Form.Control
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Add new image URL"
                  />
                  <Button onClick={handleAddImage} variant="primary">
                    Add Image
                  </Button>
                </>
              )}
            </Form.Group>
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        {editing ? (
          <>
            <Button variant="secondary" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete Product
            </Button>
            <div className="other-edits">
              <AddTags productId={editableProduct.id} />
              <AddDesigns productId={editableProduct.id} />
              <AddSizes productId={editableProduct.id} />
              {/* <AddVariants productId={editableProduct.id} /> */}
            </div>
          </>
        ) : (
          <Button variant="primary" onClick={() => setEditing(true)}>
            Edit
          </Button>
        )}
        <Button variant="secondary" onClick={onCancel}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProduct;
