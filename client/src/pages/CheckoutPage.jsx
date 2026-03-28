import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { clearCartItems } from '../store/cartSlice';

const BASE_URL = "https://eternal-attires.onrender.com";

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

  // Load Razorpay Script seamlessly
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
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      // 1. Fetch Key from Server
      const { data: keyData } = await axios.get(`${BASE_URL}/api/payment/razorpay/key`, config);

      // 2. Create Order on Server
      const { data: orderData } = await axios.post(`${BASE_URL}/api/payment/razorpay/order`, {
        amount: cart.totalPrice
      }, config);

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
            await axios.post(`${BASE_URL}/api/payment/razorpay/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }, config);

            // 5. Create Order in the Database natively
            const orderPayload = {
              orderItems: cart.cartItems,
              shippingAddress: cart.shippingAddress,
              paymentMethod: 'Razorpay',
              paymentInfo: {
                id: response.razorpay_payment_id,
                status: 'Success'
              },
              itemsPrice: cart.itemsPrice,
              taxPrice: cart.taxPrice,
              shippingPrice: cart.shippingPrice,
              totalPrice: cart.totalPrice,
            };

            const { data: placedOrder } = await axios.post(`${BASE_URL}/api/orders`, orderPayload, config);
            
            // 6. Mark it as Paid
            await axios.put(`${BASE_URL}/api/orders/${placedOrder._id}/pay`, {
               id: response.razorpay_payment_id,
               status: 'COMPLETED'
            }, config);

            // 7. Cleanup & redirect
            dispatch(clearCartItems());
            navigate(`/ordersuccess/${placedOrder._id}`);
            
          } catch (err) {
            toast.error("Payment Verification Failed!");
          }
        },
        prefill: {
          name: userInfo.name,
          email: userInfo.email,
        },
        theme: {
          color: "#be185d", // primary-700
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to initialize payment');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Order Info */}
        <div className="w-full md:w-2/3 space-y-6">
          <div className="bg-white p-6 rounded border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold uppercase tracking-wide text-gray-900 mb-4 border-b pb-2">Shipping Information</h2>
            <p className="text-gray-700"><span className="font-semibold text-gray-900">Name: </span>{userInfo.name}</p>
            <p className="text-gray-700 mt-2">
              <span className="font-semibold text-gray-900">Address: </span>
              {cart.shippingAddress.street}, {cart.shippingAddress.city}, {cart.shippingAddress.state}, {cart.shippingAddress.zipCode}, {cart.shippingAddress.country}
            </p>
          </div>

          <div className="bg-white p-6 rounded border border-gray-100 shadow-sm">
             <h2 className="text-xl font-bold uppercase tracking-wide text-gray-900 mb-4 border-b pb-2">Order Items</h2>
             {cart.cartItems.length === 0 ? (
               <p>Your cart is empty <Link to="/">Go Back</Link></p>
             ) : (
               <ul className="divide-y divide-gray-100">
                  {cart.cartItems.map((item, idx) => (
                    <li key={idx} className="py-4 flex gap-4 items-center">
                       <img src={item.image || (item.images?.length > 0 ? item.images[0].url : 'https://via.placeholder.com/50')} alt={item.name} className="w-16 h-16 object-cover rounded" />
                       <div className="flex-1">
                          <Link to={`/product/${item._id}`} className="font-semibold text-gray-900 hover:underline">{item.name}</Link>
                          {item.size && <p className="text-sm text-gray-500">Size: {item.size}</p>}
                       </div>
                       <div className="font-medium text-gray-900">
                          {item.qty} x Rs. {item.price} = Rs. {item.qty * item.price}
                       </div>
                    </li>
                  ))}
               </ul>
             )}
          </div>
        </div>

        {/* Summary side */}
        <div className="w-full md:w-1/3">
           <div className="bg-white p-6 rounded border border-gray-100 shadow-sm sticky top-20">
              <h2 className="text-xl font-bold uppercase tracking-wide text-gray-900 mb-4 border-b pb-2">Order Total</h2>
              
              <div className="space-y-3 mb-6">
                 <div className="flex justify-between text-gray-600"><span>Items</span><span>Rs. {cart.itemsPrice}</span></div>
                 <div className="flex justify-between text-gray-600"><span>Shipping</span><span>Rs. {cart.shippingPrice}</span></div>
                 <div className="flex justify-between text-gray-600"><span>Tax</span><span>Rs. {cart.taxPrice}</span></div>
                 <div className="flex justify-between font-bold text-lg text-gray-900 pt-4 border-t">
                    <span>Total</span>
                    <span>Rs. {cart.totalPrice}</span>
                 </div>
              </div>

              <button 
                 disabled={cart.cartItems.length === 0}
                 onClick={handlePayment}
                 className="w-full bg-[#3395ff] hover:bg-[#2573cc] text-white font-bold py-3 rounded shadow transition uppercase tracking-wider flex justify-center items-center gap-2"
              >
                  Pay with Razorpay
              </button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
