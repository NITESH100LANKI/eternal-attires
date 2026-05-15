import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, toggleWishlist } from '../utils/api';
import { addToCart } from '../store/cartSlice';
import { updateWishlist } from '../store/authSlice';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';
import { Heart, ShoppingBag, Star, Share2, ChevronRight, ShieldCheck, RotateCcw, Truck } from 'lucide-react';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');

  const { userInfo } = useSelector((state) => state.auth);
  const isWishlisted = userInfo?.wishlist?.includes(id);

  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);
        const { data } = await fetchProductById(id);
        setProduct(data);
        if (data.sizes?.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
      } catch (error) {
        toast.error('Product not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [id, navigate]);

  const addToCartHandler = () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    dispatch(addToCart({ 
      _id: product._id,
      name: product.name,
      brand: product.brand,
      image: product.image || product.images?.[0],
      price: product.price,
      stock: product.stock,
      qty, 
      size: selectedSize 
    }));
    toast.success('Added to Bag');
  };

  const handleWishlist = async () => {
    if (!userInfo) {
      toast.error('Please login to wishlist items');
      return;
    }
    try {
      const { data } = await toggleWishlist(product._id);
      dispatch(updateWishlist(data));
      toast.success(isWishlisted ? 'Removed from Wishlist' : 'Added to Wishlist');
    } catch (error) {
      toast.error('Error updating wishlist');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-gray-400 mb-10">
          <Link to="/" className="hover:text-black">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link to={`/?category=${product.category}`} className="hover:text-black">{product.category}</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-black">{product.brand} {product.name}</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Images Grid */}
          <div className="w-full lg:w-3/5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.images && product.images.length > 0 ? (
              product.images.map((img, idx) => (
                <div key={idx} className="aspect-[3/4] overflow-hidden bg-gray-50 rounded-sm">
                  <img src={img} alt={`${product.name} ${idx}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-zoom-in" />
                </div>
              ))
            ) : (
              <div className="aspect-[3/4] overflow-hidden bg-gray-50 rounded-sm col-span-2">
                <img src={product.image || 'https://via.placeholder.com/600x800'} alt={product.name} className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="w-full lg:w-2/5 space-y-8">
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tight text-gray-900">{product.brand}</h1>
              <p className="text-xl text-gray-500 font-light mt-1">{product.name}</p>
              
              <div className="flex items-center gap-2 mt-4 px-3 py-1 border border-gray-100 w-fit rounded-sm bg-gray-50/50">
                <span className="text-sm font-bold">{product.averageRating || 4.2}</span>
                <Star className="h-3.5 w-3.5 fill-green-600 text-green-600" />
                <span className="text-gray-300 mx-1">|</span>
                <span className="text-xs text-gray-500 font-bold">{product.numOfReviews || 128} Ratings</span>
              </div>
            </div>

            <div className="border-y border-gray-100 py-6">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-black tracking-tighter">₹{product.price}</span>
                {product.oldPrice && (
                  <span className="text-lg text-gray-400 line-through font-light">MRP ₹{product.oldPrice}</span>
                )}
                {product.discount && (
                  <span className="text-lg font-black text-orange-500 uppercase">({product.discount}% OFF)</span>
                )}
              </div>
              <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mt-1">Inclusive of all taxes</p>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-black uppercase tracking-widest">Select Size</h3>
                  <button className="text-[10px] font-black uppercase text-primary-500 tracking-widest">Size Chart <ChevronRight className="inline h-3 w-3" /></button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                        selectedSize === size
                          ? 'border-primary-500 text-primary-500 bg-primary-50 ring-2 ring-primary-500/20'
                          : 'border-gray-100 text-gray-600 hover:border-black'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={addToCartHandler}
                disabled={product.stock === 0}
                className="flex-[2] bg-primary-500 text-white font-black py-4 rounded-sm shadow-xl hover:bg-primary-600 transition-all uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 disabled:bg-gray-200"
              >
                <ShoppingBag className="h-4 w-4" />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Bag'}
              </button>
              <button 
                onClick={handleWishlist}
                className={`flex-1 border font-black py-4 rounded-sm transition-all uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 ${
                  isWishlisted 
                    ? 'bg-gray-900 border-gray-900 text-white' 
                    : 'bg-white border-gray-200 text-black hover:border-black'
                }`}
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
                {isWishlisted ? 'Wishlisted' : 'Wishlist'}
              </button>
            </div>

            {/* Delivery Options */}
            <div className="pt-8 space-y-6">
               <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                 Delivery Options <Truck className="h-4 w-4" />
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="flex items-start gap-3 p-3 border border-gray-50 rounded-sm">
                   <RotateCcw className="h-5 w-5 text-gray-400 mt-0.5" />
                   <div>
                     <p className="text-[10px] font-bold uppercase tracking-tight">14 Days Returns</p>
                     <p className="text-[10px] text-gray-500">Easy return & exchange</p>
                   </div>
                 </div>
                 <div className="flex items-start gap-3 p-3 border border-gray-50 rounded-sm">
                   <ShieldCheck className="h-5 w-5 text-gray-400 mt-0.5" />
                   <div>
                     <p className="text-[10px] font-bold uppercase tracking-tight">100% Original</p>
                     <p className="text-[10px] text-gray-500">Genuine products only</p>
                   </div>
                 </div>
               </div>
            </div>

            {/* Description */}
            <div className="pt-8 border-t border-gray-100">
              <h3 className="text-xs font-black uppercase tracking-widest mb-4">Product Details</h3>
              <p className="text-sm text-gray-600 font-light leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
