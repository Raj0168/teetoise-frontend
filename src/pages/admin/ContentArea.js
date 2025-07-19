import React from "react";
import AdminDashboard from "../../components/admin/AdminDashboard";
import AddProduct from "../../components/admin/AddProduct/AddProduct";
import ViewModifyProduct from "../../components/admin/ViewModifyProduct";
import HomeContent from "../../components/admin/HomeContent";
import BlogContent from "../../components/admin/BlogContent";
import FaqContent from "../../components/admin/FaqContent";
import PersonalizedSection from "../../components/admin/PersonalizedSection";
import ManageUsers from "../../components/admin/ManageUsers";
import ManageRefunds from "../../components/admin/ManageRefunds";
import ManageOrders from "../../components/admin/ManageOrders";
import ManageReturns from "../../components/admin/ManageReturns";
import ViewUserData from "../../components/admin/ViewUserData";

const ContentArea = ({ selectedSection }) => {
  switch (selectedSection) {
    case "dashboard":
      return <AdminDashboard />;
    case "addProduct":
      return <AddProduct />;
    case "viewModifyProduct":
      return <ViewModifyProduct />;
    case "homeContent":
      return <HomeContent />;
    case "blogContent":
      return <BlogContent />;
    case "faqContent":
      return <FaqContent />;
    case "personalizedSection":
      return <PersonalizedSection />;
    case "manageUsers":
      return <ManageUsers />;
    case "manageOrders":
      return <ManageOrders />;
    case "manageRefunds":
      return <ManageRefunds />;
    case "manageReturns":
      return <ManageReturns />;
    case "viewUserData":
      return <ViewUserData />;
    default:
      return <AdminDashboard />;
  }
};

export default ContentArea;
