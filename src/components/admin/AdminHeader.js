import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { MdLogin, MdLogout } from "react-icons/md";
import { logout } from "../../redux/slices/userSlice";
import "./AdminHeader.scss";

const AdminHeader = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, token } = useSelector((state) => state.user);

  const handleAuthClick = () => {
    if (user && token) {
      dispatch(logout());
    } else {
      navigate("/developer-portal/login");
    }
  };

  return (
    <header className="header">
      <div className="header__logo">
        <Link to="/developer-portal">
          <div className="main-logo"></div>
        </Link>
      </div>
      <h3 className="heading">ADMIN PORTAL</h3>
      <h3 className="ml-2" onClick={handleAuthClick}>
        {user && token ? (
            <MdLogout size={24} className="header__icon" />
        ) : (
          <MdLogin size={24} className="header__icon" />
        )}
      </h3>
    </header>
  );
};

export default AdminHeader;
