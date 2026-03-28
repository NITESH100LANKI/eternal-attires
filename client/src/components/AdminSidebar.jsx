import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaBoxOpen, FaClipboardList, FaUsers } from 'react-icons/fa';

const AdminSidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100';
  };

  return (
    <div className="w-64 bg-white shadow-md min-h-[calc(100vh-64px)] hidden md:block border-r border-gray-200">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 uppercase tracking-widest mb-8">Admin Panel</h2>
        <nav className="space-y-2">
          <Link
            to="/admin/dashboard"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/dashboard')}`}
          >
            <FaTachometerAlt className="text-lg" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link
            to="/admin/productlist"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/productlist')}`}
          >
            <FaBoxOpen className="text-lg" />
            <span className="font-medium">Products</span>
          </Link>
          <Link
            to="/admin/orderlist"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/orderlist')}`}
          >
            <FaClipboardList className="text-lg" />
            <span className="font-medium">Orders</span>
          </Link>
          <Link
            to="/admin/userlist"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive('/admin/userlist')}`}
          >
            <FaUsers className="text-lg" />
            <span className="font-medium">Users</span>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default AdminSidebar;
