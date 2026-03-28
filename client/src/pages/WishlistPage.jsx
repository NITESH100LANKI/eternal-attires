import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';

const WishlistPage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    const fetchWishlist = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await api.get('/api/users/wishlist', config);
        setWishlistProducts(data);
      } catch (error) {
        toast.error('Failed to load wishlist items');
      }
      setLoading(false);
    };

    fetchWishlist();
  }, [userInfo, navigate]);

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[60vh]">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 uppercase">
           My <span className="text-primary-600">Wishlist</span>
        </h2>
        <div className="h-1 w-20 bg-primary-600 mx-auto mt-4 rounded-full"></div>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="text-center bg-white p-10 rounded shadow-sm border border-gray-100">
           <p className="text-gray-500 mb-4 text-lg">Your wishlist is empty.</p>
           <Link to="/" className="inline-block bg-primary-600 text-white px-6 py-2 rounded hover:bg-primary-700 transition">
             Discover Products
           </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">
          {wishlistProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
