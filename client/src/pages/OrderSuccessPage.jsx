import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const OrderSuccessPage = () => {
  const { id } = useParams();

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-8 bg-white p-10 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-center">
            <FaCheckCircle className="text-green-500 w-24 h-24" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Payment Successful!
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Your order has been placed securely. We've sent you an email with the transaction details.
        </p>
        
        <div className="bg-gray-50 border border-gray-200 rounded p-4 my-6 font-mono text-sm break-all text-gray-800">
           Order ID: {id}
        </div>

        <div className="flex flex-col gap-3">
            <Link to="/profile" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 transition uppercase tracking-wide">
               View My Orders
            </Link>
            <Link to="/" className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition uppercase tracking-wide">
               Continue Shopping
            </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
