import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Search, ShoppingBag, User, Heart, Menu, X, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { logout } from '../store/authSlice';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logoutHandler = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?keyword=${searchTerm}`);
    } else {
      navigate('/');
    }
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-3' : 'bg-white/80 backdrop-blur-md py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center">
            <span className="text-2xl font-black tracking-tighter text-black uppercase">Eternal Attires</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 uppercase text-sm font-bold tracking-wide">
            <Link to="/?category=Men" className="hover:text-primary-500 transition-colors">Men</Link>
            <Link to="/?category=Women" className="hover:text-primary-500 transition-colors">Women</Link>
            <Link to="/?category=Kids" className="hover:text-primary-500 transition-colors">Kids</Link>
            <Link to="/?category=Home" className="hover:text-primary-500 transition-colors">Home & Living</Link>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search for products, brands and more"
                className="w-full bg-gray-100 border-none rounded-md py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
            </form>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-6">
            <div className="hidden sm:flex flex-col items-center cursor-pointer group" onClick={() => navigate(userInfo ? '/profile' : '/login')}>
              <User className="h-5 w-5 group-hover:text-primary-500 transition-colors" />
              <span className="text-[10px] font-bold mt-1 uppercase group-hover:text-primary-500">{userInfo ? 'Profile' : 'Login'}</span>
            </div>

            <Link to="/wishlist" className="flex flex-col items-center group">
              <Heart className="h-5 w-5 group-hover:text-primary-500 transition-colors" />
              <span className="text-[10px] font-bold mt-1 uppercase group-hover:text-primary-500">Wishlist</span>
            </Link>

            <Link to="/cart" className="flex flex-col items-center group relative">
              <ShoppingBag className="h-5 w-5 group-hover:text-primary-500 transition-colors" />
              <span className="text-[10px] font-bold mt-1 uppercase group-hover:text-primary-500">Bag</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {userInfo && (
              <button onClick={logoutHandler} className="hidden sm:flex flex-col items-center group">
                <LogOut className="h-5 w-5 group-hover:text-red-500 transition-colors" />
                <span className="text-[10px] font-bold mt-1 uppercase group-hover:text-red-500">Logout</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-4 shadow-lg">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-gray-100 border-none rounded-md py-2 pl-10 pr-4 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 h-4 w-4" />
          </form>
          <div className="flex flex-col space-y-3 font-bold uppercase text-sm">
            <Link to="/?category=Men" onClick={() => setIsMobileMenuOpen(false)}>Men</Link>
            <Link to="/?category=Women" onClick={() => setIsMobileMenuOpen(false)}>Women</Link>
            <Link to="/?category=Kids" onClick={() => setIsMobileMenuOpen(false)}>Kids</Link>
            <hr />
            {userInfo ? (
              <>
                <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>My Profile</Link>
                <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>Admin Dashboard</Link>
                <button onClick={logoutHandler} className="text-left">Logout</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login / Signup</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
