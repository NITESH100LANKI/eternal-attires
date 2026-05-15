import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Loader from './components/Loader';
import ProtectedRoute from './components/ProtectedRoute';

// Lazy loaded pages for performance
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ShippingPage = lazy(() => import('./pages/ShippingPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));

// Admin Pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const ProductList = lazy(() => import('./pages/admin/ProductList'));
const ProductEdit = lazy(() => import('./pages/admin/ProductEdit'));
const OrderList = lazy(() => import('./pages/admin/OrderList'));
const UserList = lazy(() => import('./pages/admin/UserList'));

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white text-gray-900 font-sans selection:bg-black selection:text-white">
        <Toaster 
          position="top-center" 
          toastOptions={{
            duration: 3000,
            style: {
              background: '#000',
              color: '#fff',
              fontSize: '12px',
              borderRadius: '2px',
              fontWeight: '900',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }
          }} 
        />
        <Navbar />
        
        <main className="flex-grow pt-20">
          <Suspense fallback={<Loader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* User Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/shipping" element={<ShippingPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-success/:id" element={<OrderSuccessPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/wishlist" element={<WishlistPage />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<ProtectedRoute adminOnly={true} />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/products" element={<ProductList />} />
                <Route path="/admin/product/:id/edit" element={<ProductEdit />} />
                <Route path="/admin/orders" element={<OrderList />} />
                <Route path="/admin/users" element={<UserList />} />
              </Route>

              {/* 404 Route */}
              <Route path="*" element={
                <div className="flex flex-col items-center justify-center py-40">
                  <h1 className="text-9xl font-black mb-4 tracking-tighter opacity-10">404</h1>
                  <p className="text-xl font-light text-gray-400 mb-8 uppercase tracking-[0.3em]">Page Not Found</p>
                  <Link to="/" className="px-10 py-4 bg-black text-white text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-2xl">
                    Back to Store
                  </Link>
                </div>
              } />
            </Routes>
          </Suspense>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
