import React, { useState, useEffect, useCallback } from "react";
import {
  Navbar,
  Nav,
  Form,
  Button,
  Dropdown,
  Image,
  Offcanvas,
  NavDropdown,
} from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import { Link, useNavigate } from "react-router-dom";
import {
  MdArrowBack,
  MdOutlineShoppingCart,
  MdOutlineSearch,
  MdMenu,
  MdExpandMore,
  MdExpandLess,
} from "react-icons/md";
import { IoMdHeartHalf } from "react-icons/io";
import { LuUserCircle2 } from "react-icons/lu";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "../../redux/slices/userSlice";
import { axiosInstance } from "../../axiosInstance";
import "./Header.scss";
import defaultAvatar from "../../assets/images/sample_user.jpg";

const Header = () => {
  const [search, setSearch] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [location, setLocation] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [categorySuggestions, setCategorySuggestions] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const handleSearchChange = (e) => setSearch(e.target.value);

  const clearSearch = () => setSearch("");

  const toggleSidebar = () => setShowSidebar(!showSidebar);
  const closeSidebar = () => setShowSidebar(false);

  const performSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      const serviceSearch = search.trim();
      navigate(`/products?searchQuery=${encodeURIComponent(serviceSearch)}`);
      closeSearch();
    }
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearch("");
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await axiosInstance.post("/auth/logout", {});
      dispatch(logout());
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      setLoading(false);
    }
  };

  const fetchSuggestions = useCallback(async (query) => {
    try {
      const serviceQuery = query.trim();
      const response = await axiosInstance.get(
        `product/suggestions?query=${serviceQuery}`
      );
      setSuggestions(response.data.products);
      setCategorySuggestions(response.data.categories);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  }, []);

  useEffect(() => {
    if (search.length >= 3) {
      const debounceTimeout = setTimeout(() => {
        fetchSuggestions(search);
      }, 300);

      return () => clearTimeout(debounceTimeout);
    } else {
      setSuggestions([]);
      setCategorySuggestions([]);
    }
  }, [search, fetchSuggestions]);

  // useEffect(() => {
  //   const storedLocation = localStorage.getItem("location");

  //   if (!storedLocation && navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(async (position) => {
  //       const { latitude, longitude } = position.coords;

  //       try {
  //         const response = await axios.get(
  //           `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
  //         );

  //         const city = response.data.city;
  //         setLocation(city);
  //         localStorage.setItem("location", city);
  //         setPinCode("123456");
  //         localStorage.setItem("pinCode", "123456");
  //       } catch (error) {
  //         console.error("Error fetching location data:", error);
  //       }
  //     });
  //   } else if (storedLocation) {
  //     setLocation(storedLocation);
  //     setPinCode(localStorage.getItem("pinCode") || "");
  //   }
  // }, [location]);

  if (loading) {
    return <div className="loading-container"></div>;
  }

  const handleButtonClick = () => {
    if (user) {
      navigate("/cart");
    } else {
      navigate("/auth/login");
    }
  };

  const handleWishlistButtonClick = () => {
    if (user) {
      navigate("/wishlist");
    } else {
      navigate("/auth/login");
    }
  };

  const handleCategoryClick = (tag) => {
    navigate(`/products?tags=${tag}`);
    toggleSidebar();
  };

  return (
    <>
      <Navbar expand="lg" className="header-class">
        {!isSearchOpen && isMobile && (
          <button type="button" className="react-icon" onClick={toggleSidebar}>
            <MdMenu />
          </button>
        )}
        {!isSearchOpen && (
          <Navbar.Brand as={Link} to="/" className="main-logo"></Navbar.Brand>
        )}

        {!isSearchOpen && !isMobile && (
          <Nav className="mr-auto nav-style">
            <Nav.Link onClick={() => navigate("/trending")}>Trending</Nav.Link>
            <Nav.Link href="/new-arrivals">New Arrivals</Nav.Link>
            <Nav.Link href="/blogs">Blog</Nav.Link>
            {/* {location && <Nav.Link>Delivering to {location}</Nav.Link>} */}
          </Nav>
        )}

        {!isMobile && (
          <Form
            inline="true"
            className="search-form-mobile d-flex align-items-center"
          >
            <div className="search-bar-container">
              <input
                type="text"
                placeholder="Search"
                className="search-input"
                value={search}
                onChange={handleSearchChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    performSearch(e);
                  }
                }}
              />
              {search && (
                <button
                  type="button"
                  className="clear-button"
                  onClick={clearSearch}
                >
                  ✖
                </button>
              )}
            </div>
            <button
              type="button"
              className="react-icon"
              onClick={performSearch}
            >
              <MdOutlineSearch />
            </button>
          </Form>
        )}

        {isMobile && !isSearchOpen && (
          <button
            type="button"
            className="button-search-icon"
            onClick={() => setIsSearchOpen(true)}
          >
            <MdOutlineSearch />
          </button>
        )}

        {isSearchOpen && (
          <div className="search-bar-mobile">
            <button type="button" className="react-icon" onClick={closeSearch}>
              <MdArrowBack />
            </button>
            <Form
              inline="true"
              className="search-form-mobile d-flex align-items-center"
            >
              <div className="search-bar-container">
                <input
                  type="text"
                  placeholder="Search"
                  className="search-input"
                  value={search}
                  onChange={handleSearchChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      performSearch(e);
                    }
                  }}
                />
                {search && (
                  <button
                    type="button"
                    className="clear-button"
                    onClick={clearSearch}
                  >
                    ✖
                  </button>
                )}
              </div>
            </Form>
            <button
              type="button"
              className="button-search-icon"
              onClick={performSearch}
            >
              <MdOutlineSearch />
            </button>
          </div>
        )}

        {!isSearchOpen && (
          <>
            <button
              type="button"
              className=" react-icon"
              onClick={handleWishlistButtonClick}
            >
              <IoMdHeartHalf />
            </button>
            <button
              type="button"
              className="react-icon"
              onClick={handleButtonClick}
            >
              <MdOutlineShoppingCart />
            </button>
            <div className="header-right">
              {!user ? (
                <button
                  type="button"
                  className="ml-2 react-icon"
                  onClick={() => navigate("/auth/login")}
                >
                  <LuUserCircle2 />
                </button>
              ) : (
                <Dropdown className="ml-2">
                  <Dropdown.Toggle
                    as="div"
                    id="dropdown-custom"
                    className="dropdown-toggle no-caret"
                    style={{ border: "none", backgroundColor: "transparent" }} // Custom style to ensure no borders or backgrounds
                  >
                    <div
                      style={{
                        width: "30px",
                        height: "30px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "50%",
                        backgroundColor: "#B47431",
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      {user?.userName?.charAt(0).toUpperCase() || "U"}
                    </div>
                  </Dropdown.Toggle>
                  <Dropdown.Menu align="end">
                    <Dropdown.Header>
                      Hi {user?.userName?.split(" ")[0]}!
                    </Dropdown.Header>
                    <Dropdown.Item as={Link} to="/account">
                      My Account
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/orders">
                      My Orders
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/wishlist">
                      Wishlists
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </div>
          </>
        )}
      </Navbar>

      {search.length >= 3 &&
        (suggestions.length > 0 || categorySuggestions.length > 0) && (
          <div className="suggestions-container">
            {/* {categorySuggestions.length > 0 && (
              <div className="suggestion-categories">
                {categorySuggestions.map((category) => (
                  <div key={category.name} className="suggestion-item">
                    <span className="categoryName">{category.name}</span>
                  </div>
                ))}
                <hr />
              </div>
            )} */}
            {suggestions.length > 0 && (
              <div className="suggestion-product">
                {suggestions.map((product) => (
                  <div
                    key={product.product_id}
                    className="suggestion-item"
                    onClick={() => {
                      navigate(`/product/${product.product_name}`);
                      closeSearch();
                    }}
                  >
                    {product.product_title}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      <Offcanvas
        show={showSidebar}
        onHide={toggleSidebar}
        placement="start"
        className="offcanvas-slide modern-sidebar"
        style={{ width: "75vw" }}
      >
        <Offcanvas.Header
          closeButton
          className="modern-header"
          style={{
            height: "58px",
            backgroundColor: "#F8D32A",
            borderBottom: "2px solid #000",
          }}
        >
          <Navbar.Brand as={Link} to="/" className="main-logo"></Navbar.Brand>
        </Offcanvas.Header>

        <Offcanvas.Body>
          <Nav className="flex-column">
            <Nav.Link
              onClick={() => setShowCategories(!showCategories)}
              className="nav-item d-flex align-items-center"
            >
              Shop By Categories
              {showCategories ? (
                <MdExpandLess
                  style={{ fontSize: "1rem", marginLeft: "1.3rem" }}
                />
              ) : (
                <MdExpandMore
                  style={{ fontSize: "1rem", marginLeft: "1.3rem" }}
                />
              )}
            </Nav.Link>
            {showCategories && (
              <Nav className="flex-column" style={{ marginLeft: "1.5rem" }}>
                <a
                  onClick={() => handleCategoryClick("SOLID")}
                  className="small-item"
                >
                  Monochrome Magic
                </a>
                <a
                  onClick={() => handleCategoryClick("OVERSIZED")}
                  className="small-item"
                >
                  Oversized Tees
                </a>
                <a
                  onClick={() => handleCategoryClick("REGULAR")}
                  className="small-item"
                >
                  Classic Tees
                </a>
                <a
                  onClick={() => handleCategoryClick("FEMME")}
                  className="small-item"
                >
                  Femme Fashion
                </a>
              </Nav>
            )}
            <Nav.Link
              onClick={() => {
                toggleSidebar();
                navigate("/trending");
              }}
              className="nav-item"
            >
              Trending
            </Nav.Link>
            <Nav.Link
              onClick={() => {
                navigate("/new-arrivals");
                toggleSidebar();
              }}
              className="nav-item"
            >
              New Arrivals
            </Nav.Link>
            <Nav.Link
              onClick={() => {
                navigate("/blogs");
                toggleSidebar();
              }}
              className="nav-item"
            >
              Blog
            </Nav.Link>
            <Nav.Link
              onClick={() => {
                navigate("/faqs");
                toggleSidebar();
              }}
              className="nav-item"
            >
              FAQs
            </Nav.Link>
            {user && (
              <Nav.Link
                onClick={() => {
                  navigate("/orders");
                  toggleSidebar();
                }}
                className="nav-item"
              >
                My Orders
              </Nav.Link>
            )}
            {user && (
              <Nav.Link
                onClick={() => {
                  navigate("/account");
                  toggleSidebar();
                }}
                className="nav-item"
              >
                My Account
              </Nav.Link>
            )}
            <hr />
            <a
              onClick={() => {
                navigate("/about-us");
                toggleSidebar();
              }}
              className="small-item"
            ></a>
            <a
              onClick={() => {
                navigate("/privacy-policy");
                toggleSidebar();
              }}
              className="small-item"
            >
              Privacy Policy
            </a>
            <a
              onClick={() => {
                navigate("/terms-of-service");
                toggleSidebar();
              }}
              className="small-item"
            >
              Terms Of Service
            </a>
            <a
              onClick={() => {
                navigate("/contact-us");
                toggleSidebar();
              }}
              className="small-item"
            >
              Contact Us
            </a>
            <a
              onClick={() => {
                navigate("/shipping-policy");
                toggleSidebar();
              }}
              className="small-item"
            >
              Shipping Policy
            </a>
            <a
              onClick={() => {
                navigate("/returns-and-exchange");
                toggleSidebar();
              }}
              className="small-item"
            >
              Returns & Refunds policy
            </a>
            <a
              onClick={() => {
                navigate("/about-us");
                toggleSidebar();
              }}
              className="small-item"
            >
              About Us
            </a>
          </Nav>
          {user ? (
            <div>
              <button
                type="button"
                style={{ margin: "1rem" }}
                className="side-button"
                onClick={() => {
                  toggleSidebar();
                  handleLogout();
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <div>
              <button
                type="button"
                style={{ margin: "1rem" }}
                className="side-button"
                onClick={() => {
                  navigate("/auth/login");
                  toggleSidebar();
                }}
              >
                Login/SignUp
              </button>
            </div>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default Header;
