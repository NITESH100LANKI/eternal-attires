import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { fetchProducts } from '../utils/api';
import Loader from '../components/Loader';
import toast from 'react-hot-toast';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  
  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const { data } = await fetchProducts({ keyword, category, sort });
        setProducts(data);
      } catch (error) {
        toast.error('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, [keyword, category, sort]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      {!keyword && !category && (
        <section className="relative h-[60vh] overflow-hidden bg-black flex items-center">
          <div className="absolute inset-0 opacity-60">
            <img 
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80" 
              alt="Fashion Hero" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white z-10">
            <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter uppercase">Eternal Essentials</h1>
            <p className="text-xl md:text-2xl mb-8 font-light max-w-xl">Curated collection of minimal black and white aesthetics for the modern professional.</p>
            <button className="bg-white text-black px-10 py-4 font-bold uppercase tracking-widest hover:bg-primary-500 hover:text-white transition-all transform hover:scale-105">
              Shop Now
            </button>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 border-b border-gray-100 pb-6">
          <h2 className="text-2xl font-bold uppercase tracking-tight text-gray-900">
            {keyword ? `Search Results for "${keyword}"` : category ? `${category} Collection` : 'All Products'}
            <span className="ml-3 text-sm font-medium text-gray-400">({products.length} items)</span>
          </h2>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Sort By:</span>
            <select 
              className="border-none bg-gray-50 text-sm font-bold focus:ring-0 cursor-pointer rounded px-4 py-2"
              value={sort}
              onChange={(e) => window.location.href = `/?keyword=${keyword}&category=${category}&sort=${e.target.value}`}
            >
              <option value="">Recommended</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-[3/4] rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold mb-2">No items found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
