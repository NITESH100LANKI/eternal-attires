import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { FaBox, FaTimes, FaCheck } from 'react-icons/fa';
import { setCredentials } from '../store/authSlice';

const BASE_URL = "https://eternal-attires.onrender.com";

const ProfilePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
    } else {
      setName(userInfo.name);
      setEmail(userInfo.email);

      // Fetch user's orders natively
      const fetchMyOrders = async () => {
         try {
           const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
           const { data } = await axios.get(`${BASE_URL}/api/orders/myorders`, { ...config, withCredentials: true });
           setOrders(data);
         } catch (error) {
           toast.error('Failed to load your orders');
         }
         setLoadingOrders(false);
      };
      
      fetchMyOrders();
    }
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.put(`${BASE_URL}/api/users/profile`, { name, email, password }, { ...config, withCredentials: true });
      dispatch(setCredentials(data));
      toast.success('Profile updated');
    } catch (err) {
      toast.error('Profile update failed');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
         <div className="w-full md:w-1/3">
            <h2 className="text-xl font-bold mb-4 uppercase text-gray-900 border-b pb-2 tracking-wide">User Profile</h2>
            <form onSubmit={submitHandler} className="bg-white p-6 rounded shadow-sm border border-gray-100 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" className="w-full mt-1 border border-gray-300 rounded p-2 focus:ring-primary-500" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" className="w-full mt-1 border border-gray-300 rounded p-2 focus:ring-primary-500" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input type="password" placeholder="Leave blank to keep current" className="w-full mt-1 border border-gray-300 rounded p-2 focus:ring-primary-500" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input type="password" placeholder="Leave blank to keep current" className="w-full mt-1 border border-gray-300 rounded p-2 focus:ring-primary-500" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
              <button type="submit" className="w-full bg-gray-900 text-white font-bold py-3 mt-4 rounded transition hover:bg-gray-800 uppercase text-sm tracking-wider">
                 Update Profile
              </button>
            </form>
         </div>

         <div className="w-full md:w-2/3">
            <h2 className="text-xl font-bold mb-4 uppercase text-gray-900 border-b pb-2 tracking-wide">My Orders</h2>
            {loadingOrders ? (
              <Loader />
            ) : orders.length === 0 ? (
              <div className="bg-blue-50 text-blue-800 p-4 rounded mt-4">You do not have any orders yet.</div>
            ) : (
              <div className="bg-white shadow-sm rounded border border-gray-100 overflow-x-auto">
                 <table className="w-full text-left border-collapse text-sm">
                   <thead>
                     <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase">
                       <th className="px-4 py-3">ID</th>
                       <th className="px-4 py-3">Date</th>
                       <th className="px-4 py-3">Total</th>
                       <th className="px-4 py-3">Paid</th>
                       <th className="px-4 py-3">Delivered</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                      {orders.map((order) => (
                         <tr key={order._id} className="hover:bg-gray-50 transition">
                           <td className="px-4 py-3 text-gray-500 font-mono">{order._id.substring(0, 8)}...</td>
                           <td className="px-4 py-3">{new Date(order.createdAt).toLocaleDateString()}</td>
                           <td className="px-4 py-3 text-gray-900 font-medium">Rs. {order.totalPrice}</td>
                           <td className="px-4 py-3">
                              {order.isPaid ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />}
                           </td>
                           <td className="px-4 py-3">
                              {order.isDelivered ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />}
                           </td>
                         </tr>
                      ))}
                   </tbody>
                 </table>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};

export default ProfilePage;
