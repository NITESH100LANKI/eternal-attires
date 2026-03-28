import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AdminSidebar from './AdminSidebar';
import { toast } from 'react-toastify';

const AdminLayout = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') {
      toast.error('Not authorized as an admin');
      navigate('/login');
    }
  }, [userInfo, navigate]);

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
