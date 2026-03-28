import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import ShippingPage from './pages/ShippingPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import ProfilePage from './pages/ProfilePage';
import WishlistPage from './pages/WishlistPage';

// Admin Pages
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductList from './pages/admin/ProductList';
import ProductEdit from './pages/admin/ProductEdit';
import OrderList from './pages/admin/OrderList';

const App = () => {
  return (
    <Router>
      <Header />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/shipping" element={<ShippingPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/ordersuccess/:id" element={<OrderSuccessPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/wishlist" element={<WishlistPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="productlist" element={<ProductList />} />
            <Route path="product/:id/edit" element={<ProductEdit />} />
            <Route path="product/new/edit" element={<ProductEdit />} />
            <Route path="orderlist" element={<OrderList />} />
          </Route>
        </Routes>
      </main>
      <Footer />
      <ToastContainer position="bottom-right" />
    </Router>
  );
};

export default App;
