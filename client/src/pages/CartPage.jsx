import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FaTrash } from 'react-icons/fa';
import { addToCart, removeFromCart } from '../store/cartSlice';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8 uppercase tracking-wide text-gray-900">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center bg-white p-10 rounded shadow-sm border border-gray-100">
          <p className="text-gray-500 mb-4 text-lg">Your cart is empty.</p>
          <Link to="/" className="inline-block bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700 transition">
            Go Back Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items List */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white border border-gray-100 rounded shadow-sm overflow-hidden">
              <ul className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <li key={item._id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-center sm:items-start group transition hover:bg-gray-50">
                    {/* Item Image */}
                    <Link to={`/product/${item._id}`} className="shrink-0 w-24 h-32 sm:w-28 sm:h-36 bg-gray-100 rounded overflow-hidden">
                      <img src={item.image || 'https://via.placeholder.com/300x400?text=Product'} alt={item.name} className="w-full h-full object-cover" />
                    </Link>

                    {/* Item Details */}
                    <div className="flex-1 flex flex-col justify-between w-full h-full py-1">
                      <div>
                        <div className="flex justify-between w-full text-base font-bold text-gray-900 capitalize">
                          <h3>
                            <Link to={`/product/${item._id}`}>{item.brand || item.name}</Link>
                          </h3>
                          <p className="ml-4 tabular-nums">Rs. {item.price}</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{item.description || item.name}</p>
                        {item.size && (
                          <div className="mt-2 text-sm text-gray-500">
                            Size: <span className="font-semibold text-gray-800">{item.size}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <select
                          className="border border-gray-300 rounded p-1 text-sm focus:ring-primary-500"
                          value={item.qty}
                          onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                        >
                          {[...Array(item.stock > 0 ? (item.stock > 5 ? 5 : item.stock) : 0).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => removeFromCartHandler(item._id)}
                          className="font-medium text-red-500 hover:text-red-700 flex items-center gap-1 text-sm"
                        >
                          <FaTrash /> Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white border border-gray-100 rounded shadow-sm p-6 sticky top-20">
              <h2 className="text-xl font-bold mb-4 uppercase tracking-wide text-gray-900 border-b pb-4">Order Summary</h2>

              <ul className="space-y-4 mb-6">
                <li className="flex justify-between text-gray-600">
                  <span>Price ({cartItems.reduce((acc, item) => acc + item.qty, 0)} items)</span>
                  <span className="font-medium text-gray-900">Rs. {cart.itemsPrice}</span>
                </li>
                <li className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900">
                    {Number(cart.shippingPrice) === 0 ? 'Free' : `Rs. ${cart.shippingPrice}`}
                  </span>
                </li>
                <li className="flex justify-between text-gray-600">
                  <span>GST (15%)</span>
                  <span className="font-medium text-gray-900">Rs. {cart.taxPrice}</span>
                </li>
              </ul>

              <div className="border-t border-gray-200 pt-4 mb-6 flex justify-between font-bold text-lg text-gray-900">
                <span>Total Amount</span>
                <span>Rs. {cart.totalPrice}</span>
              </div>

              <button
                type="button"
                disabled={cartItems.length === 0}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded shadow-md transition disabled:bg-gray-400 disabled:cursor-not-allowed uppercase tracking-wider text-sm"
                onClick={checkoutHandler}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
