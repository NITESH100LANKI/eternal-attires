import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getMyOrders, updateProfile as updateProfileApi } from '../utils/api';
import { setCredentials } from '../store/authSlice';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { Package, User, Mail, Lock, CheckCircle2, XCircle, ChevronRight, Settings } from 'lucide-react';

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

      const fetchMyOrders = async () => {
         try {
           setLoadingOrders(true);
           const { data } = await getMyOrders();
           setOrders(data);
         } catch (error) {
           toast.error('Failed to load your orders');
         } finally {
           setLoadingOrders(false);
         }
      };
      
      fetchMyOrders();
    }
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      const { data } = await updateProfileApi({ name, email, password });
      dispatch(setCredentials({ ...userInfo, ...data }));
      toast.success('Profile updated successfully');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Profile update failed');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Profile Sidebar */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100">
              <div className="flex flex-col items-center mb-8">
                <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center mb-4 border-2 border-primary-100">
                  <User className="h-10 w-10 text-primary-500" />
                </div>
                <h2 className="text-sm font-black uppercase tracking-widest text-gray-900">{userInfo?.name}</h2>
                <p className="text-xs text-gray-500 mt-1">{userInfo?.email}</p>
              </div>

              <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 border-b pb-2">Account Settings</h3>
              <form onSubmit={submitHandler} className="space-y-5">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-tight text-gray-500">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input 
                      type="text" 
                      className="w-full bg-gray-50 border-none rounded-sm py-2 pl-10 text-sm focus:ring-1 focus:ring-primary-500" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-tight text-gray-500">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input 
                      type="email" 
                      className="w-full bg-gray-50 border-none rounded-sm py-2 pl-10 text-sm focus:ring-1 focus:ring-primary-500" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-tight text-gray-500">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      className="w-full bg-gray-50 border-none rounded-sm py-2 pl-10 text-sm focus:ring-1 focus:ring-primary-500" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-tight text-gray-500">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      className="w-full bg-gray-50 border-none rounded-sm py-2 pl-10 text-sm focus:ring-1 focus:ring-primary-500" 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                    />
                  </div>
                </div>
                <button type="submit" className="w-full bg-black text-white font-black py-3 rounded-sm shadow-lg hover:bg-gray-800 transition-all uppercase tracking-widest text-[10px] mt-4 flex items-center justify-center gap-2">
                  <Settings className="h-3 w-3" />
                  Update Profile
                </button>
              </form>
            </div>
          </div>

          {/* Orders Section */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <div className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 min-h-[600px]">
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-8 flex items-center gap-3">
                <Package className="h-5 w-5 text-primary-500" />
                My Orders <span className="text-gray-400">({orders.length})</span>
              </h2>

              {loadingOrders ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-24 bg-gray-50 animate-pulse rounded-sm"></div>
                  ))}
                </div>
              ) : orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="bg-gray-50 p-6 rounded-full mb-6">
                    <Package className="h-12 w-12 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-bold">No orders found</h3>
                  <p className="text-gray-500 text-sm mt-2 max-w-xs">You haven't placed any orders yet. Start shopping to see them here.</p>
                  <button onClick={() => navigate('/')} className="mt-8 px-8 py-3 bg-black text-white text-xs font-black uppercase tracking-widest hover:bg-gray-800 shadow-xl transition-all">
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order._id} className="border border-gray-100 hover:border-gray-200 transition-all p-6 group">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Order ID</p>
                          <p className="font-mono text-xs text-gray-800">{order._id}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Date</p>
                          <p className="text-xs font-bold text-gray-900">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 mb-6 overflow-x-auto pb-2">
                        {order.orderItems.map((item, idx) => (
                          <div key={idx} className="shrink-0 group-hover:scale-105 transition-transform">
                            <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-sm border border-gray-50" />
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-gray-50 gap-4">
                        <div className="flex gap-6">
                          <div className="flex items-center gap-2">
                            {order.isPaid ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-orange-500" />
                            )}
                            <span className={`text-[10px] font-black uppercase tracking-widest ${order.isPaid ? 'text-green-600' : 'text-orange-500'}`}>
                              {order.isPaid ? 'Paid' : 'Payment Pending'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {order.isDelivered ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <Truck className="h-4 w-4 text-blue-500" />
                            )}
                            <span className={`text-[10px] font-black uppercase tracking-widest ${order.isDelivered ? 'text-green-600' : 'text-blue-500'}`}>
                              {order.isDelivered ? 'Delivered' : order.orderStatus}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-black tracking-tighter">₹{order.totalPrice}</span>
                          <button 
                            onClick={() => navigate(`/order-success/${order._id}`)}
                            className="p-2 hover:bg-gray-50 rounded-full transition-colors"
                          >
                            <ChevronRight className="h-5 w-5 text-gray-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
