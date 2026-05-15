import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCartItems } from '../store/cartSlice';
import { createOrder, createRazorpayOrder, verifyRazorpayPayment } from '../utils/api';
import toast from 'react-hot-toast';
import { ShoppingBag, CreditCard, ChevronRight } from 'lucide-react';
import api from '../api/axiosConfig';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!cart.shippingAddress.street) {
      navigate('/shipping');
    }
  }, [cart.shippingAddress, navigate]);

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const res = await loadRazorpay();
    if (!res) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      // 1. Fetch Key from Server (Using raw api for key fetching as it's simple)
      const { data: keyData } = await api.get('/api/payments/razorpay/key');

      // 2. Create Order on Server
      const { data: orderData } = await createRazorpayOrder(cart.totalPrice);

      // 3. Init Razorpay Modal
      const options = {
        key: keyData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Eternal Attires",
        description: "Premium Fashion Purchase",
        order_id: orderData.id,
        handler: async function (response) {
          try {
            // 4. Verify Payment Server-Side
            await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            // 5. Create Order in the Database
            const orderPayload = {
              orderItems: cart.cartItems.map(item => ({
                name: item.name,
                qty: item.qty,
                image: item.image || item.images?.[0],
                price: item.price,
                product: item._id
              })),
              shippingAddress: cart.shippingAddress,
              paymentMethod: 'Razorpay',
              paymentResult: {
                id: response.razorpay_payment_id,
                status: 'Success',
                update_time: new Date().toISOString(),
                email_address: userInfo.email
              },
              itemsPrice: cart.itemsPrice,
              taxPrice: cart.taxPrice,
              shippingPrice: cart.shippingPrice,
              totalPrice: cart.totalPrice,
            };

            const { data: placedOrder } = await createOrder(orderPayload);
            
            // 6. Mark it as Paid on server (Order controller should handle this or we do it here)
            // For now, assume createOrder with paymentResult handles it.

            // 7. Cleanup & redirect
            dispatch(clearCartItems());
            toast.success('Order placed successfully!');
            navigate(`/order-success/${placedOrder._id}`);
            
          } catch (err) {
            toast.error("Payment Verification Failed!");
          }
        },
        prefill: {
          name: userInfo.name,
          email: userInfo.email,
        },
        theme: {
          color: "#000000",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to initialize payment');
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-gray-400 mb-8">
          <Link to="/cart" className="hover:text-black">Bag</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to="/shipping" className="hover:text-black">Address</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-black">Payment</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100">
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-4 flex items-center gap-2">
                Delivery Address
              </h2>
              <div className="text-sm space-y-1">
                <p className="font-bold">{userInfo.name}</p>
                <p className="text-gray-600">{cart.shippingAddress.street}</p>
                <p className="text-gray-600">{cart.shippingAddress.city}, {cart.shippingAddress.state} - {cart.shippingAddress.zipCode}</p>
                <p className="text-gray-600">{cart.shippingAddress.country}</p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100">
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-4">Select Payment Method</h2>
              <div className="p-4 border-2 border-primary-500 rounded flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <CreditCard className="h-6 w-6 text-primary-500" />
                  <div>
                    <p className="font-bold text-sm">Razorpay (Cards, UPI, Netbanking)</p>
                    <p className="text-xs text-gray-500">Secure payment via Razorpay</p>
                  </div>
                </div>
                <div className="h-4 w-4 rounded-full border-4 border-primary-500"></div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100">
              <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 mb-4">Order Summary ({cart.cartItems.length} items)</h2>
              <div className="divide-y divide-gray-100">
                {cart.cartItems.map((item) => (
                  <div key={item._id} className="py-4 flex gap-4">
                    <img src={item.image || item.images?.[0]} alt={item.name} className="w-16 h-20 object-cover rounded-sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate uppercase">{item.brand || 'Eternal'}</p>
                      <p className="text-xs text-gray-500 truncate">{item.name}</p>
                      <p className="text-xs mt-1 font-bold">Qty: {item.qty}</p>
                    </div>
                    <div className="text-sm font-bold">
                      ₹{item.price * item.qty}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Price Details Side */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 border-b pb-4">Price Details</h2>
              
              <div className="space-y-4 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total MRP</span>
                  <span>₹{cart.itemsPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (GST)</span>
                  <span className="text-green-600">₹{cart.taxPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping Fee</span>
                  <span className={cart.shippingPrice > 0 ? '' : 'text-green-600'}>
                    {cart.shippingPrice > 0 ? `₹${cart.shippingPrice}` : 'FREE'}
                  </span>
                </div>
                <div className="flex justify-between font-black text-base pt-4 border-t border-gray-100 mt-4">
                  <span>Total Amount</span>
                  <span>₹{cart.totalPrice}</span>
                </div>
              </div>

              <button
                onClick={handlePayment}
                className="w-full bg-primary-500 text-white font-bold py-4 rounded-sm shadow-lg hover:bg-primary-600 transition-all uppercase tracking-widest text-sm flex items-center justify-center gap-2"
              >
                <ShoppingBag className="h-4 w-4" />
                Place Order
              </button>

              <p className="text-[10px] text-gray-400 mt-4 text-center">
                100% Secure Payments | Authentic Products
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
