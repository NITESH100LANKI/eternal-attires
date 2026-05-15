import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, ShoppingBag, Plus, Minus, ArrowRight } from 'lucide-react';
import { addToCart, removeFromCart } from '../store/cartSlice';
import toast from 'react-hot-toast';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice } = useSelector((state) => state.cart);

  const updateQtyHandler = (item, qty) => {
    if (qty > item.stock) {
      toast.error('Not enough stock available');
      return;
    }
    dispatch(addToCart({ ...item, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
    toast.success('Item removed from bag');
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400 mb-8 flex items-center gap-3">
          <ShoppingBag className="h-4 w-4" />
          My Shopping Bag <span className="text-black font-black">({cartItems.length} Items)</span>
        </h1>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border border-dashed border-gray-200 rounded-lg">
            <div className="bg-gray-50 p-6 rounded-full mb-6">
              <ShoppingBag className="h-12 w-12 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Hey, it feels so light!</h2>
            <p className="text-gray-500 mb-8 max-w-xs text-center">There is nothing in your bag. Let's add some items.</p>
            <Link 
              to="/" 
              className="bg-black text-white px-10 py-3 font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg"
            >
              Add Items From Wishlist
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-6">
              {cartItems.map((item) => (
                <div key={item._id} className="group relative flex gap-6 p-4 border border-gray-100 hover:border-gray-200 transition-all">
                  {/* Image */}
                  <Link to={`/product/${item._id}`} className="shrink-0 w-32 h-44 bg-gray-50 overflow-hidden rounded-sm">
                    <img 
                      src={item.image || item.images?.[0]} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                    />
                  </Link>

                  {/* Content */}
                  <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-tight text-gray-900 truncate">
                          {item.brand || 'Eternal'}
                        </h3>
                        <p className="text-xs text-gray-500 font-light truncate">{item.name}</p>
                      </div>
                      <button 
                        onClick={() => removeFromCartHandler(item._id)}
                        className="text-gray-400 hover:text-black transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-4 items-center">
                      {/* Qty Selector */}
                      <div className="flex items-center border border-gray-200 rounded-sm">
                        <button 
                          onClick={() => updateQtyHandler(item, Math.max(1, item.qty - 1))}
                          className="px-2 py-1 hover:bg-gray-50"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-4 py-1 text-xs font-bold border-x border-gray-200">{item.qty}</span>
                        <button 
                          onClick={() => updateQtyHandler(item, item.qty + 1)}
                          className="px-2 py-1 hover:bg-gray-50"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      
                      {item.size && (
                        <div className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-gray-100 text-gray-600 rounded-sm">
                          Size: {item.size}
                        </div>
                      )}
                    </div>

                    <div className="mt-auto flex items-center gap-3 pt-4">
                      <span className="text-sm font-black text-gray-900 font-mono tracking-tighter">₹{item.price}</span>
                      {item.oldPrice && (
                        <span className="text-xs text-gray-400 line-through font-light">₹{item.oldPrice}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm">
                  <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 border-b pb-4">Coupons</h2>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-bold flex items-center gap-2">
                      <Plus className="h-4 w-4" /> Apply Coupon
                    </span>
                    <button className="text-primary-500 font-black uppercase text-xs border border-primary-500 px-3 py-1 rounded-sm hover:bg-primary-50">Apply</button>
                  </div>
                </div>

                <div className="bg-white p-6 border border-gray-100 shadow-sm rounded-sm">
                  <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 border-b pb-4">Price Details ({cartItems.length} Items)</h2>
                  
                  <div className="space-y-4 text-sm mb-6 font-light">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total MRP</span>
                      <span>₹{itemsPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">GST (15%)</span>
                      <span className="text-green-600">₹{taxPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping Fee</span>
                      <span className={Number(shippingPrice) > 0 ? '' : 'text-green-600'}>
                        {Number(shippingPrice) > 0 ? `₹${shippingPrice}` : 'FREE'}
                      </span>
                    </div>
                    <div className="flex justify-between font-black text-base pt-4 border-t border-gray-100 mt-4 tracking-tighter">
                      <span>Total Amount</span>
                      <span>₹{totalPrice}</span>
                    </div>
                  </div>

                  <button
                    onClick={checkoutHandler}
                    className="w-full bg-black text-white font-bold py-4 rounded-sm shadow-xl hover:bg-gray-800 transition-all uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 group"
                  >
                    Place Order
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
