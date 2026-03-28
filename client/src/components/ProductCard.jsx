import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { updateWishlist } from '../store/authSlice';
import api from '../api/axiosConfig';
import { toast } from 'react-toastify';

const Rating = ({ value, text }) => {
  return (
    <div className="flex items-center space-x-1 text-yellow-400 text-xs">
      {[1, 2, 3, 4, 5].map((index) => (
        <span key={index}>
          {value >= index ? (
            <FaStar />
          ) : value >= index - 0.5 ? (
            <FaStarHalfAlt />
          ) : (
            <FaRegStar />
          )}
        </span>
      ))}
      {text && <span className="text-gray-500 ml-1">({text})</span>}
    </div>
  );
};

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const isWished = userInfo && userInfo.wishlist ? userInfo.wishlist.includes(product._id) : false;

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userInfo) {
      toast.warn('Please login to add to wishlist');
      return navigate('/login');
    }
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await api.post('/api/users/wishlist', { productId: product._id }, config);
      dispatch(updateWishlist(data));
      if (isWished) toast.info('Removed from wishlist');
      else toast.success('Added to wishlist');
    } catch (err) {
      toast.error('Failed to update wishlist');
    }
  };

  return (
    <div className="group relative border border-gray-100 rounded-md overflow-hidden bg-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Wishlist Button Overlay */}
      <button 
         onClick={toggleWishlist}
         className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 hover:bg-white text-gray-400 hover:text-primary-500 shadow-sm opacity-100 transition-opacity duration-200"
      >
        {isWished ? <FaHeart className="w-4 h-4 text-primary-500" /> : <FaRegHeart className="w-4 h-4 group-hover:block" />}
      </button>

      <Link to={`/product/${product._id}`}>
        <div className="relative w-full aspect-[4/5] overflow-hidden bg-gray-200">
          <img
            src={product?.images && product.images.length > 0 ? product.images[0].url : product.image || 'https://via.placeholder.com/300x400?text=Product'}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="p-4">
          <h3 className="text-sm font-bold text-gray-900 truncate mb-1">
            {product.brand}
          </h3>
          <p className="text-sm text-gray-500 truncate mb-2">
            {product.name}
          </p>
          
          <div className="mb-2">
             <Rating value={product.averageRating || 4.5} text={product.numOfReviews || 12} />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold text-gray-900">
              Rs. {product.price}
            </span>
            {product.discountPrice && (
              <span className="text-xs text-gray-500 line-through">
                Rs. {product.discountPrice}
              </span>
            )}
            {product.discountPrice && (
              <span className="text-xs font-semibold text-orange-500">
                ({Math.round(((product.discountPrice - product.price) / product.discountPrice) * 100)}% OFF)
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
