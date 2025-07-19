import React from "react";
import { Nav } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdChevronRight, MdChevronLeft } from "react-icons/md";

const Sidebar = ({ openSection, handleSectionClick, handleNavClick }) => {
  const navigate = useNavigate();

  // Access user and token from Redux store
  const { user, token } = useSelector((state) => state.user);

  // Function to handle navigation with authentication check
  const handleAuthenticatedNavClick = (navItem) => {
    if (user && token && user?.userType === "admin") {
      handleNavClick(navItem);
    } else {
      navigate("/developer-portal/login");
    }
  };

  return (
    <Nav variant="pills" className="flex-column sidebar">
      <Nav.Item>
        <Nav.Link onClick={() => handleNavClick("dashboard")}>
          Dashboard
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link onClick={() => handleSectionClick("products")}>
          Products{" "}
          {openSection === "products" ? <MdChevronLeft /> : <MdChevronRight />}
        </Nav.Link>
        {openSection === "products" && (
          <Nav className="flex-column ml-3">
            <Nav.Item>
              <Nav.Link
                onClick={() => handleAuthenticatedNavClick("addProduct")}
              >
                Add New Product
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                onClick={() => handleAuthenticatedNavClick("viewModifyProduct")}
              >
                View/Modify Product
              </Nav.Link>
            </Nav.Item>
          </Nav>
        )}
      </Nav.Item>
      <Nav.Item>
        <Nav.Link onClick={() => handleSectionClick("pageData")}>
          Page Data{" "}
          {openSection === "pageData" ? <MdChevronLeft /> : <MdChevronRight />}
        </Nav.Link>
        {openSection === "pageData" && (
          <Nav className="flex-column ml-3">
            <Nav.Item>
              <Nav.Link
                onClick={() => handleAuthenticatedNavClick("homeContent")}
              >
                Add/Modify Home Content
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                onClick={() => handleAuthenticatedNavClick("blogContent")}
              >
                Add/Modify Blog Content
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                onClick={() => handleAuthenticatedNavClick("faqContent")}
              >
                Add/Modify FAQ Content
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                onClick={() =>
                  handleAuthenticatedNavClick("personalizedSection")
                }
              >
                Add/Modify Personalized Section Content
              </Nav.Link>
            </Nav.Item>
          </Nav>
        )}
      </Nav.Item>
      <Nav.Item>
        <Nav.Link onClick={() => handleSectionClick("orders")}>
          Orders{" "}
          {openSection === "orders" ? <MdChevronLeft /> : <MdChevronRight />}
        </Nav.Link>
        {openSection === "orders" && (
          <Nav className="flex-column ml-3">
            <Nav.Item>
              <Nav.Link
                onClick={() => handleAuthenticatedNavClick("manageOrders")}
              >
                Manage Orders
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                onClick={() => handleAuthenticatedNavClick("manageRefunds")}
              >
                Manage Refunds
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                onClick={() => handleAuthenticatedNavClick("manageReturns")}
              >
                Manage Returns
              </Nav.Link>
            </Nav.Item>
          </Nav>
        )}
      </Nav.Item>
      <Nav.Item>
        <Nav.Link onClick={() => handleSectionClick("manageUsers")}>
          Manage Users{" "}
          {openSection === "manageUsers" ? (
            <MdChevronLeft />
          ) : (
            <MdChevronRight />
          )}
        </Nav.Link>
        {openSection === "manageUsers" && (
          <Nav className="flex-column ml-3">
            <Nav.Item>
              <Nav.Link
                onClick={() => handleAuthenticatedNavClick("manageUsers")}
              >
                View/Remove Users
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                onClick={() => handleAuthenticatedNavClick("viewUserData")}
              >
                View User Data
              </Nav.Link>
            </Nav.Item>
          </Nav>
        )}
      </Nav.Item>
    </Nav>
  );
};

export default Sidebar;
