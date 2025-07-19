import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Button,
  Form,
  Card,
  Spinner,
  InputGroup,
} from "react-bootstrap";
import { axiosInstance } from "../../axiosInstance";
import EditProduct from "./EditProduct";
import "./ViewModifyProduct.scss";

const ViewModifyProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const loadProducts = useCallback(
    async (searchQuery = "", offset = 0, append = false) => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/product/products?sortBy=popularity&sortOrder=desc&limit=10&offset=${offset}&searchQuery=${searchQuery}`
        );
        const fetchedProducts = response.data || [];
        setProducts((prevProducts) =>
          append ? [...prevProducts, ...fetchedProducts] : fetchedProducts
        );
        setHasMore(fetchedProducts.length === 10);
        setOffset((prevOffset) => prevOffset + 10);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    loadProducts(searchQuery, 0);
  }, [searchQuery, loadProducts]);

  const handleSearch = (e) => {
    e.preventDefault();
    setOffset(0);
    loadProducts(searchQuery, 0);
  };

  const handleRefresh = () => {
    setSearchQuery("");
    setOffset(0);
    loadProducts("", 0);
  };

  const handleScroll = (e) => {
    if (
      e.target.scrollTop + e.target.clientHeight >=
        e.target.scrollHeight - 50 &&
      hasMore &&
      !loading
    ) {
      loadProducts(searchQuery, offset, true);
    }
  };

  useEffect(() => {
    const container = document.querySelector(".view-modify-product");
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleViewEdit = async (productId) => {
    try {
      const response = await axiosInstance.get(
        `/product/products/${productId}`
      );
      const product = response.data || {};
      setSelectedProduct(product);
      setShowEditModal(true);
      
    } catch (error) {
      console.error("Failed to fetch product details:", error);
    }
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <Card
        className="view-modify-product"
        style={{ maxHeight: "80vh", overflowY: "auto" }}
      >
        <Card.Body>
          <h2>View & Modify Products</h2>
          <Form onSubmit={handleSearch}>
            <InputGroup className="mb-3">
              <Form.Control
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="primary" type="submit">
                Search
              </Button>
              <Button
                variant="secondary"
                onClick={handleRefresh}
                className="ms-2"
              >
                Refresh
              </Button>
            </InputGroup>
          </Form>
          {products.length === 0 && !loading && <p>No results found.</p>}
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Category</th>
                <th>Availability</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <tr key={product.id}>
                  <td>{index + 1}</td>
                  <td>{product.product_title || "N/A"}</td>
                  <td>{product.product_selling_price || "N/A"}</td>
                  <td>{product.available_discount || "N/A"}</td>
                  <td>{product.product_category || "N/A"}</td>
                  <td>
                    {product.product_availability ? "Available" : "Unavailable"}
                  </td>
                  <td>{product.stock_availability || "N/A"}</td>
                  <td>
                    <Button
                      variant="warning"
                      onClick={() => handleViewEdit(product?.product_name)}
                    >
                      View/Edit
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {loading && (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
            </div>
          )}
        </Card.Body>
      </Card>

      {showEditModal && selectedProduct && (
        <EditProduct product={selectedProduct} onCancel={handleCloseModal} />
      )}
    </>
  );
};

export default ViewModifyProduct;
