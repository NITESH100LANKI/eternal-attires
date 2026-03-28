import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';

const HeroCarousel = () => {
  return (
    <div className="relative w-full h-[60vh] bg-gray-100 mb-12 flex items-center justify-center overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=2670"
        alt="Hero Banner"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="relative z-10 text-center text-white px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight -mt-10 md:mt-0">
          SEASONAL SALE
        </h1>
        <p className="text-xl md:text-2xl mb-8 font-light">
          Up to 50% off on all premium attire.
        </p>
        <button className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-10 rounded shadow-lg transition-colors duration-200 uppercase tracking-widest text-sm">
          Shop Now
        </button>
      </div>
    </div>
  );
};

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/products');
        setProducts(data);
      } catch (error) {
        toast.error('Failed to load products');
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  return (
    <>
      <HeroCarousel />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 uppercase">
             Trending <span className="text-primary-600">Now</span>
          </h2>
          <div className="h-1 w-20 bg-primary-600 mx-auto mt-4 rounded-full"></div>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>

      <div className="bg-primary-50 py-16 mb-20">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Subscribe to our Newsletter</h3>
          <p className="mb-8 text-gray-600">Get the latest fashion news and updates right in your inbox.</p>
          <div className="max-w-md mx-auto flex">
            <input type="email" placeholder="Your email address" className="flex-1 rounded-l-md border-gray-300 focus:ring-primary-500 focus:border-primary-500 py-3 px-4 border" />
            <button className="bg-gray-900 text-white px-6 py-3 rounded-r-md font-semibold hover:bg-gray-800 transition">Subscribe</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
