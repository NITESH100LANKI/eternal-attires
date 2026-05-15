import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import { toggleWishlist } from '../utils/api';
import { updateWishlist } from '../store/authSlice';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const isWishlisted = userInfo?.wishlist?.includes(product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart({ ...product, qty: 1 }));
    toast.success('Added to Bag');
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
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

  return (
    <div className="group relative bg-white transition-all duration-300 flex flex-col h-full">
      <Link to={`/product/${product._id}`} className="flex-grow">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 rounded-sm">
          <img
            src={product.image || product.images?.[0]}
            alt={product.name}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          
          {/* Wishlist Button */}
          <button 
            onClick={handleWishlist}
            className={`absolute top-3 right-3 p-2 rounded-full shadow-sm transition-all ${isWishlisted ? 'bg-primary-500 text-white' : 'bg-white text-gray-400 hover:text-primary-500'}`}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          {/* Quick Add (Visible on Hover) */}
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/90 backdrop-blur-sm">
            <button 
              onClick={handleAddToCart}
              className="w-full bg-black text-white py-2 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-800"
            >
              <ShoppingBag className="h-3 w-3" />
              Add to Bag
            </button>
          </div>

          {/* Rating Badge */}
          {product.averageRating > 0 && (
            <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-sm px-1.5 py-0.5 rounded flex items-center gap-1 shadow-sm">
              <span className="text-[10px] font-bold">{product.averageRating}</span>
              <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
              <span className="text-[10px] text-gray-400 border-l border-gray-300 pl-1">{product.numOfReviews}</span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="mt-3 space-y-1">
          <h3 className="text-sm font-bold text-gray-900 truncate uppercase tracking-tight">{product.brand || 'Eternal'}</h3>
          <p className="text-xs text-gray-500 truncate font-light tracking-wide">{product.name}</p>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-900">₹{product.price}</span>
            {product.oldPrice && (
              <span className="text-xs text-gray-400 line-through font-light">₹{product.oldPrice}</span>
            )}
            {product.discount && (
              <span className="text-[10px] font-bold text-orange-500 uppercase tracking-tighter">({product.discount}% OFF)</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
