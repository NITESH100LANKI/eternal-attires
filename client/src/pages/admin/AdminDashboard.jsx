import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import { FaUsers, FaBoxOpen, FaMoneyBillWave } from 'react-icons/fa';

const BASE_URL = "https://eternal-attires.onrender.com";

const AdminDashboard = () => {
  const [data, setData] = useState({ users: 0, orders: 0, products: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        // We will mock the backend logic by fetching all independently, 
        // ideally a dedicated /api/admin/stats route is used.
        const [usersRes, productsRes, ordersRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/users`, { withCredentials: true }),
          axios.get(`${BASE_URL}/api/products`, { withCredentials: true }),
          axios.get(`${BASE_URL}/api/orders`, { withCredentials: true })
        ]);

        const revenue = ordersRes.data.reduce((acc, order) => acc + (order.isPaid ? order.totalPrice : 0), 0);

        setData({
          users: usersRes.data.length,
          products: productsRes.data.length,
          orders: ordersRes.data.length,
          revenue: revenue.toFixed(2)
        });
      } catch (error) {
        toast.error('Failed to load dashboard statistics');
      }
      setLoading(false);
    };

    fetchStats();
  }, [userInfo]);

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8 text-gray-800 uppercase tracking-wider">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-semibold mb-1 uppercase tracking-wider">Total Revenue</p>
            <h3 className="text-2xl font-bold text-gray-900">Rs. {data.revenue}</h3>
          </div>
          <div className="bg-green-100 text-green-600 p-4 rounded-full">
            <FaMoneyBillWave className="text-xl" />
          </div>
        </div>

        {/* Users */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-semibold mb-1 uppercase tracking-wider">Total Users</p>
            <h3 className="text-2xl font-bold text-gray-900">{data.users}</h3>
          </div>
          <div className="bg-blue-100 text-blue-600 p-4 rounded-full">
            <FaUsers className="text-xl" />
          </div>
        </div>

        {/* Orders */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-semibold mb-1 uppercase tracking-wider">Total Orders</p>
            <h3 className="text-2xl font-bold text-gray-900">{data.orders}</h3>
          </div>
          <div className="bg-orange-100 text-orange-600 p-4 rounded-full">
            <FaBoxOpen className="text-xl" />
          </div>
        </div>

        {/* Products */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-semibold mb-1 uppercase tracking-wider">Products</p>
            <h3 className="text-2xl font-bold text-gray-900">{data.products}</h3>
          </div>
          <div className="bg-purple-100 text-purple-600 p-4 rounded-full">
            <FaBoxOpen className="text-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
