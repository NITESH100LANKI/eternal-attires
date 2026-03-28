import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '../store/cartSlice';

const ShippingPage = () => {
  const { shippingAddress } = useSelector((state) => state.cart);
  
  const [address, setAddress] = useState(shippingAddress.street || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.zipCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');
  const [stateName, setStateName] = useState(shippingAddress.state || '');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ street: address, city, state: stateName, zipCode: postalCode, country }));
    navigate('/checkout');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-8 uppercase tracking-wide text-gray-900">Shipping Details</h1>
      
      <form onSubmit={submitHandler} className="bg-white p-6 rounded shadow-sm border border-gray-100 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Address / Street</label>
          <input type="text" className="w-full mt-1 border border-gray-300 rounded p-2 focus:ring-primary-500" value={address} onChange={(e) => setAddress(e.target.value)} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <input type="text" className="w-full mt-1 border border-gray-300 rounded p-2 focus:ring-primary-500" value={city} onChange={(e) => setCity(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">State / Province</label>
              <input type="text" className="w-full mt-1 border border-gray-300 rounded p-2 focus:ring-primary-500" value={stateName} onChange={(e) => setStateName(e.target.value)} required />
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Postal Code</label>
              <input type="text" className="w-full mt-1 border border-gray-300 rounded p-2 focus:ring-primary-500" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input type="text" className="w-full mt-1 border border-gray-300 rounded p-2 focus:ring-primary-500" value={country} onChange={(e) => setCountry(e.target.value)} required />
            </div>
        </div>

        <button type="submit" className="w-full bg-primary-600 text-white font-bold py-3 mt-6 rounded hover:bg-primary-700 transition uppercase tracking-wide">
          Continue to Payment
        </button>
      </form>
    </div>
  );
};

export default ShippingPage;
