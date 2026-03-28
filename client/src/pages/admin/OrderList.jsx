import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';
import { useSelector } from 'react-redux';
import { FaTruck, FaTimes } from 'react-icons/fa';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchOrders();
  }, [userInfo]);

  const fetchOrders = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.get((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/orders', { ...config, withCredentials: true });
      setOrders(data);
    } catch (error) {
      toast.error('Failed to fetch orders');
    }
    setLoading(false);
  };

  const deliverHandler = async (id) => {
    if (window.confirm('Mark this order as delivered?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        await axios.put(`http://localhost:5000/api/orders/${id}/deliver`, {}, { ...config, withCredentials: true });
        toast.success('Order delivered');
        fetchOrders();
      } catch (err) {
        toast.error('Failed to update order');
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8 text-gray-800 uppercase tracking-wider">Orders</h1>

      <div className="bg-white shadow-sm rounded-lg overflow-x-auto border border-gray-100">
        <table className="w-full whitespace-nowrap">
          <thead className="bg-gray-50 border-b border-gray-200 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Paid</th>
              <th className="px-6 py-4">Delivered</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-gray-500">{order._id.substring(0, 10)}...</td>
                <td className="px-6 py-4 font-medium text-gray-900">{order.user && order.user.name}</td>
                <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">Rs. {order.totalPrice}</td>
                <td className="px-6 py-4">
                  {order.isPaid ? (
                    <span className="text-green-600 font-semibold">{new Date(order.paidAt).toLocaleDateString()}</span>
                  ) : (
                    <FaTimes className="text-red-500" />
                  )}
                </td>
                <td className="px-6 py-4">
                  {order.isDelivered ? (
                    <span className="text-green-600 font-semibold">{new Date(order.deliveredAt).toLocaleDateString()}</span>
                  ) : (
                    <FaTimes className="text-red-500" />
                  )}
                </td>
                <td className="px-6 py-4 font-medium text-center">
                  {!order.isDelivered && (
                    <button onClick={() => deliverHandler(order._id)} className="text-indigo-600 hover:text-indigo-900 inline-block bg-indigo-50 px-3 py-1 rounded">
                      <FaTruck className="inline mr-1" /> Mark Delivered
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderList;
