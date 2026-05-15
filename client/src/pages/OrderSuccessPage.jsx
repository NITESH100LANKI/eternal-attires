import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, ShoppingBag, Package } from 'lucide-react';

const OrderSuccessPage = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white p-10 rounded-sm shadow-sm border border-gray-100 text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-green-50 p-4 rounded-full">
            <CheckCircle className="text-green-500 w-16 h-16" />
          </div>
        </div>
        
        <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-900 mb-2">
          Order Placed!
        </h2>
        <p className="text-gray-500 text-sm font-light mb-8">
          Thank you for shopping with Eternal Attires. Your order has been confirmed and will be shipped shortly.
        </p>
        
        <div className="bg-gray-50 border border-gray-100 rounded-sm p-4 mb-8 text-left">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Order ID</p>
          <p className="font-mono text-xs text-gray-800 break-all">{id}</p>
        </div>

        <div className="space-y-3">
          <Link 
            to="/profile" 
            className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-black text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-all shadow-lg"
          >
            <Package className="h-4 w-4" />
            Track Order
          </Link>
          <Link 
            to="/" 
            className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-white text-black border border-gray-200 text-xs font-bold uppercase tracking-[0.2em] hover:bg-gray-50 transition-all"
          >
            <ShoppingBag className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 font-medium italic">
            A confirmation email has been sent to your registered address.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
