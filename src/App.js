import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { Helmet } from "react-helmet";
import Header from "./components/commons/Header";
import Footer from "./components/commons/Footer";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import YourAccount from "./pages/YourAccount";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import WishlistPage from "./pages/WishlistPage";
import CartPage from "./pages/CartPage";
import DeveloperPortalPage from "./pages/admin/DeveloperPortalPage";
import AdminLogin from "./pages/admin/AdminLogin";
import TrendingProducts from "./pages/Additional/TrendingProducts";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SessionExpired from "./components/commons/SessionExpired";
import NotFoundPage from "./components/Error Pages/NotFoundPage";
import AddressAndOrderSummary from "./pages/AddressAndOrderSummary";
import NewArrivals from "./pages/Additional/NewArrivals";
import TermsOfServices from "./components/product-details/TermsOfServices";
import ReturnAndExchange from "./components/product-details/ReturnAndExchange";
import PrivacyPolicy from "./components/product-details/PrivacyPolicy";
import ContactUs from "./components/product-details/ContactUs";
import ShippingPolicy from "./components/product-details/ShippingPolicy";
import AboutUs from "./components/product-details/AboutUs";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import UserOrdersPage from "./pages/UserOrdersPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import BlogPage from "./components/blogs/BlogPage";
import BlogDetailsPage from "./components/blogs/BlogDetailsPage";
import FAQPage from "./components/product-details/FAQPage";
import ScrollToTop from "./utils/ScrollToTop";
import PaymentFailedPage from "./pages/PaymentFailed";

function Layout({ children }) {
  const location = useLocation();

  const isDeveloperPortal = location.pathname.startsWith("/developer-portal");
  const isProductDetailsPage = location.pathname.startsWith("/product/");

  return (
    <>
      <div className="main-app-header">{!isDeveloperPortal && <Header />}</div>
      <div className="main-content">
        <main>{children}</main>
      </div>
      {!isDeveloperPortal && !isProductDetailsPage && (
        <Footer className="footer" />
      )}
    </>
  );
}

function App() {
  return (
    <div className="teetoise-application">
      <Helmet>
        <title>Teetoise</title>
        <meta name="description" content="Teetoise - style slow and steady." />
        <meta property="og:title" content="Teetoise" />
        <meta
          property="og:description"
          content="Teetoise - style slow and steady"
        />
        <meta
          property="og:image"
          content="https://storage.googleapis.com/turtleman-primary-bucket/public_images/website_stuff/TEEEEEEEHEEEE.jpg"
        />
      </Helmet>
      <Router>
        <ScrollToTop />
        <Layout>
          <ToastContainer
            position="top-right"
            autoClose={2000}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            draggable
          />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/session-expired" element={<SessionExpired />} />
            <Route path="/auth/*" element={<AuthPage />} />
            <Route path="/account/*" element={<YourAccount />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/trending" element={<TrendingProducts />} />
            <Route path="/new-arrivals" element={<NewArrivals />} />
            <Route
              path="/product/:productId"
              element={<ProductDetailsPage />}
            />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/order-summary" element={<AddressAndOrderSummary />} />
            <Route
              path="/order-confirmed/:order_id"
              element={<OrderConfirmationPage />}
            />
            <Route path="/orders" element={<UserOrdersPage />} />
            <Route path="/order-details" element={<OrderDetailsPage />} />
            <Route path="/blogs" element={<BlogPage />} />
            <Route path="/blogs/:id" element={<BlogDetailsPage />} />
            <Route path="/faqs" element={<FAQPage />} />
            <Route path="/payment-failed" element={<PaymentFailedPage />} />

            <Route path="/terms-of-service" element={<TermsOfServices />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route
              path="/returns-and-exchange"
              element={<ReturnAndExchange />}
            />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/about-us" element={<AboutUs />} />

            <Route path="/developer-portal" element={<DeveloperPortalPage />} />
            <Route path="/developer-portal/login" element={<AdminLogin />} />

            <Route path="*" element={NotFoundPage} />
          </Routes>
        </Layout>
      </Router>
    </div>
  );
}

export default App;
