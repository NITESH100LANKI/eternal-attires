import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaHeart, FaChevronDown, FaShareAlt } from 'react-icons/fa';
import { addToCart } from '../store/cartSlice';
import Loader from '../components/Loader';

const BASE_URL = "https://eternal-attires.onrender.com";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/products/${id}`);
        setProduct(data);
        if (data.sizes?.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
      } catch (error) {
        toast.error('Product not found');
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const addToCartHandler = () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      toast.warn('Please select a size');
      return;
    }
    dispatch(addToCart({ ...product, qty, size: selectedSize }));
    toast.success('Added to cart');
  };

  if (loading) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex mb-8 text-sm text-gray-500">
        <Link to="/" className="hover:text-primary-600">Home</Link>
        <span className="mx-2">/</span>
        <span className="capitalize">{product.category}</span>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">{product.brand}</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Images Grid */}
        <div className="w-full lg:w-3/5 grid grid-cols-2 gap-4">
          {product.images && product.images.length > 0 ? (
            product.images.map((img, idx) => (
              <img key={idx} src={img.url} alt={`product ${idx}`} className="w-full h-auto object-cover rounded shadow-sm hover:opacity-90 transition" />
            ))
          ) : (
            <>
              <img src={product.image || 'https://via.placeholder.com/600x800?text=Image+1'} alt="product" className="w-full h-auto object-cover rounded shadow-sm" />
              <img src={'https://via.placeholder.com/600x800?text=Image+2'} alt="product" className="w-full h-auto object-cover rounded shadow-sm" />
            </>
          )}
        </div>

        {/* Product Info */}
        <div className="w-full lg:w-2/5">
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">{product.brand}</h1>
          <p className="text-xl text-gray-600 mt-2 font-light">{product.name}</p>
          
          <div className="flex border-b border-gray-200 pb-4 mt-6">
            <div className="flex items-center space-x-3 text-2xl">
              <span className="font-bold text-gray-900">Rs. {product.price}</span>
              {product.discountPrice && (
                <span className="text-gray-500 line-through text-lg">Rs. {product.discountPrice}</span>
              )}
              {product.discountPrice && (
                <span className="text-orange-500 font-bold text-lg">
                  ({Math.round(((product.discountPrice - product.price) / product.discountPrice) * 100)}% OFF)
                </span>
              )}
            </div>
          </div>

          <div className="text-green-600 font-medium text-sm mt-4">inclusive of all taxes</div>

          {/* Sizes */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-8">
              <div className="flex justify-between text-sm font-medium text-gray-900 mb-4">
                <h3>SELECT SIZE</h3>
                <button className="text-primary-600 hover:underline">SIZE CHART</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? 'border-primary-600 text-primary-600 bg-primary-50'
                        : 'border-gray-300 text-gray-600 hover:border-gray-900'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mt-8">
             <span className="text-sm font-medium text-gray-900 mb-4 block">QUANTITY</span>
             <select 
               className="border border-gray-300 rounded p-2 focus:ring-primary-500" 
               value={qty} 
               onChange={(e) => setQty(Number(e.target.value))}
             >
               {[...Array(product.stock > 0 ? (product.stock > 5 ? 5 : product.stock) : 0).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>
                    {x + 1}
                  </option>
                ))}
             </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
             <button
                onClick={addToCartHandler}
                disabled={product.stock === 0}
                className="flex-1 bg-primary-600 text-white font-bold py-4 rounded shadow hover:bg-primary-700 transition flex justify-center items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
             >
                ADD TO CART
             </button>
             <button className="flex-1 border-2 border-gray-300 text-gray-700 font-bold py-4 rounded hover:border-gray-900 hover:text-gray-900 transition flex justify-center items-center gap-2">
                <FaHeart className="w-5 h-5 text-gray-400" />
                WISHLIST
             </button>
          </div>

          {/* Product Details Section */}
          <div className="mt-12">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
              PRODUCT DETAILS
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm">
              {product.description}
            </p>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-2 gap-y-4 text-sm">
            <div className="flex flex-col">
              <span className="text-gray-500 text-xs uppercase">Category</span>
              <span className="font-medium text-gray-800">{product.category}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-xs uppercase">100% Original</span>
              <span className="font-medium text-gray-800">Guaranteed</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-xs uppercase">Pay on Delivery</span>
              <span className="font-medium text-gray-800">Available</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-xs uppercase">Easy Returns</span>
              <span className="font-medium text-gray-800">14 Days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
