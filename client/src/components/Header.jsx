import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FaShoppingCart, FaUser, FaSearch, FaBars, FaTimes, FaHeart } from 'react-icons/fa';
import { logout } from '../store/authSlice';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary-600 tracking-wider">
              ETERNAL <span className="text-gray-800">ATTIRES</span>
            </Link>
          </div>

          {/* Nav links - Desktop */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 px-3 py-2 font-medium transition-colors">Men</Link>
            <Link to="/" className="text-gray-700 hover:text-primary-600 px-3 py-2 font-medium transition-colors">Women</Link>
            <Link to="/" className="text-gray-700 hover:text-primary-600 px-3 py-2 font-medium transition-colors">Kids</Link>
            <Link to="/" className="text-gray-700 hover:text-primary-600 px-3 py-2 font-medium transition-colors">Beauty</Link>
          </nav>

          {/* Header Right */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Search */}
            <div className="relative text-gray-600 focus-within:text-primary-600">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                <FaSearch className="w-5 h-5" />
              </span>
              <input
                type="search"
                className="py-2 pl-10 bg-gray-100 rounded-md text-sm focus:outline-none focus:bg-white focus:text-gray-900 focus:ring-1 focus:ring-primary-500 w-64 transition-all"
                placeholder="Search for products, brands and more"
                autoComplete="off"
              />
            </div>

            {/* Profile & Cart */}
            {userInfo ? (
              <div className="relative group cursor-pointer inline-block">
                <div className="flex flex-col items-center text-gray-700 hover:text-primary-600 transition">
                  <FaUser className="w-5 h-5 mb-1" />
                  <span className="text-xs font-semibold">{userInfo.name.split(' ')[0]}</span>
                </div>
                {/* Dropdown menu */}
                <div className="absolute right-0 w-48 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-300">
                  <div className="p-3">
                    <p className="text-sm font-medium text-gray-900 truncate">Hello, {userInfo.name}</p>
                  </div>
                  <div className="py-1">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                    <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Orders</Link>
                  </div>
                  <div className="py-1">
                    <button onClick={logoutHandler} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="flex flex-col items-center text-gray-700 hover:text-primary-600 transition">
                <FaUser className="w-5 h-5 mb-1" />
                <span className="text-xs font-semibold">Login</span>
              </Link>
            )}

            <Link to="/wishlist" className="flex flex-col flex-wrap items-center text-gray-700 hover:text-primary-600 transition relative">
              <FaHeart className="w-5 h-5 mb-1" />
              <span className="text-xs font-semibold">Wishlist</span>
              {userInfo?.wishlist?.length > 0 && (
                <span className="absolute top-0 right-[-2px] inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-primary-600 rounded-full">
                  {userInfo.wishlist.length}
                </span>
              )}
            </Link>

            <Link to="/cart" className="flex flex-col flex-wrap items-center text-gray-700 hover:text-primary-600 transition relative">
              <FaShoppingCart className="w-5 h-5 mb-1" />
              <span className="text-xs font-semibold">Cart</span>
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-[-8px] inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-primary-600 rounded-full">
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white transition duration-150 ease-in-out"
            >
              {isMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white px-2 pt-2 pb-3 space-y-1 sm:px-3 shadow-lg absolute w-full z-40">
          <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50">Men</Link>
          <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50">Women</Link>
          <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50">Kids</Link>
          
          {userInfo ? (
            <>
              <div className="block px-3 py-2 border-t border-gray-200 text-sm text-gray-500">Welcome {userInfo.name}</div>
              <Link to="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50">Profile</Link>
              <button 
                onClick={logoutHandler}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50">Login / Register</Link>
          )}
          
          <Link to="/cart" className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50">
            Cart ({cartItems.reduce((a, c) => a + c.qty, 0)})
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
