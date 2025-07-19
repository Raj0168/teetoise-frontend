# Teetoise↗ Frontend

> **Responsive, SEO‑optimized React application for a scalable e‑commerce platform.**

---

## Tech Stack

- React (v18)
- Redux Toolkit for state management
- React Router v6 for routing
- Axios with a centralized instance and interceptors
- React Helmet for dynamic `<head>` tags (SEO)
- React.lazy & Suspense for code splitting and lazy loading
- React‑Toastify for in‑app notifications
- SCSS modules for styling
- AWS Amplify & Google Cloud Storage for asset hosting
- Custom Error Boundaries for graceful error handling
- Utilities: ScrollToTop, SessionExpired handler

---

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Raj0168/teetoise-frontend.git
   cd teetoise-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root:

   ```ini
   REACT_APP_API_BASE_URL=https://api.teetoise.com
   REACT_APP_ASSETS_URL=https://storage.googleapis.com/your-bucket
   ```

4. **Run in development mode**

   ```bash
   npm start
   ```

5. **Build for production**

   ```bash
   npm run build
   ```

---

## Repository Structure

```
src/
├── components/         # Reusable UI components
│   ├── commons/        # Header, Footer, SessionExpired, ErrorBoundary
│   ├── home/           # FeaturedProducts, NewArrivals, ShopByOccasion
│   ├── payment/        # PaymentButton, displayRazorpay
│   ├── product-details/# TermsOfService, ReturnAndExchange, FAQ, etc.
│   └── blogs/          # BlogPage, BlogDetailsPage
│
├── pages/              # Route-level pages
│   ├── HomePage.js
│   ├── ProductsPage.js
│   ├── ProductDetailsPage.js
│   ├── WishlistPage.js
│   ├── CartPage.js
│   ├── AddressAndOrderSummary.js
│   ├── OrderConfirmationPage.js
│   ├── UserOrdersPage.js
│   ├── OrderDetailsPage.js
│   ├── PaymentFailedPage.js
│   ├── AuthPage.js
│   ├── YourAccount.js
│   └── admin/          # DeveloperPortalPage, AdminLogin
│
├── redux/              # Redux slices and store
│   ├── slices/         # productsSlice.js, userSlice.js, orderSlice.js, etc.
│   └── store.js        # Redux store configuration
│
├── utils/              # Utility functions
│   ├── axiosInstance.js# Axios base instance with interceptors
   ├── ScrollToTop.js   # Scroll restoration component
   └── errorBoundary.js # Custom error boundary component
│
├── App.js              # Application root, Router, Layout, Helmet
└── index.js            # Entry point
```

---

## UI Showcase

All screenshots are taken from the live version of the application before it was taken offline. The application was fully responsive and production-ready.

### Login Page

User login screen with email/password. <img src="public/screenshots/0.Login.webp" alt="Login Page" width="150" />

### Register Page

User registration screen with input validation. <img src="public/screenshots/1.Register.webp" alt="Register Page" width="150" />

### Home Page – Banner and Promotions

Landing page with promotional banners and featured collections. <img src="public/screenshots/2.Home_1.webp" alt="Home Banner" width="150" />

### Home Page – Featured Products

Section showcasing trending and new arrival items. <img src="public/screenshots/2.Home_2.webp" alt="Featured Products" width="150" />

### Sidebar Navigation

Accessible sidebar menu optimized for mobile users. <img src="public/screenshots/3.Sidebar.webp" alt="Sidebar Navigation" width="400" />

### Product Overview

Grid layout of product listings with filters. <img src="public/screenshots/4.Product_overview.webp" alt="Product Grid" width="150" />

### Product Details Page

Detailed product information with image gallery and color, size options. <img src="public/screenshots/5.Product_details.webp" alt="Product Details" width="150" />

### Product Filters

Category, price range, and size filters. <img src="public/screenshots/5.Product_filters.webp" alt="Product Filters" width="150" />

### Alternate Product View

Product manufacturer and quality details. <img src="public/screenshots/6.Product_details_2.webp" alt="Product Detail Variant" width="150" />

### Wishlist Page

View and manage all saved products. <img src="public/screenshots/7.Product_wishlists.webp" alt="Wishlist" width="150" />

### Cart Page

Interactive cart with quantity, variant, and size management. <img src="public/screenshots/8.Product_carts.webp" alt="Cart Page" width="150" />

### Checkout Page

Delivery address input and summary before payment. <img src="public/screenshots/9.Checkout.webp" alt="Checkout Page" width="150" />

### Payment Gateway

Razorpay integration for secure transactions. <img src="public/screenshots/10.Payment.webp" alt="Payment Screen" width="150" />

### Orders Overview

List of all past orders. <img src="public/screenshots/11.Orders_overview.webp" alt="Orders Overview" width="150" />

### Order Details Page

In-depth view with delivery status and item breakdown. <img src="public/screenshots/12.Order_details.webp" alt="Order Details" width="150" />

### User Account Details

Profile settings and address management. <img src="public/screenshots/13.User_details.webp" alt="User Profile" width="150" />

### About Us

Static page with brand mission and story. <img src="public/screenshots/14.About_Us.webp" alt="About Us Page" width="150" />

### FAQs

Frequently asked questions section. <img src="public/screenshots/15.FAQs.webp" alt="FAQs" width="150" />

---

## Features & Pages

- **Homepage**: Hero banner, featured/trending products, new arrivals sections
- **Product Listing**: Filter and sort by category, price, popularity
- **Product Details**: Image gallery, size chart, add to cart/wishlist
- **Wishlist & Cart**: CRUD operations synced with the backend
- **Checkout Flow**: Address summary, Razorpay integration, SKU validation
- **Order Management**: Order confirmation, view/cancel/return/exchange
- **User Account**: Profile management, order history, password update
- **Blog**: List of articles and detailed view
- **Static Pages**: Terms of Service, Privacy Policy, Shipping Policy, FAQ, Contact Us, About Us
- **Authentication**: Sign up, login, social login, password reset
- **Admin Screens**: Developer portal and admin login stub
- **Performance**: Lazy loading, code splitting
- **SEO**: Dynamic titles and meta tags via React Helmet
- **Notifications**: Toast messages for form submissions and actions
- **Error Handling**: Global Error Boundaries and 404 page

---

## Notes

- You can customize image sizes with `width` and `height` attributes for optimal control.
- If serving from a CDN or different domain, adjust image paths accordingly.
