import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login as loginApi } from '../utils/api';
import { setCredentials } from '../store/authSlice';
import toast from 'react-hot-toast';
import { Mail, Lock, LogIn, UserPlus } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { search } = useLocation();

  const { userInfo } = useSelector((state) => state.auth);
  const redirect = new URLSearchParams(search).get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, userInfo, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await loginApi({ email, password });
      dispatch(setCredentials(data));
      toast.success('Welcome back!');
      navigate(redirect);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-gray-900">
            Eternal Attires
          </h2>
          <p className="mt-2 text-sm text-gray-500 font-light uppercase tracking-widest">
            Sign in to continue
          </p>
        </div>

        <div className="bg-white p-8 border border-gray-100 shadow-xl rounded-sm">
          <form className="space-y-6" onSubmit={submitHandler}>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-300" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-sm py-3 pl-10 text-sm focus:ring-1 focus:ring-black transition-all"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-300" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-gray-50 border-none rounded-sm py-3 pl-10 text-sm focus:ring-1 focus:ring-black transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-gray-500 uppercase tracking-widest font-bold">
                  Remember me
                </label>
              </div>

              <div className="text-xs font-bold uppercase tracking-widest">
                <a href="#" className="text-primary-500 hover:text-primary-600">
                  Forgot?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-xs font-black uppercase tracking-[0.2em] text-white bg-black hover:bg-gray-800 focus:outline-none shadow-xl transition-all disabled:bg-gray-400"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                   Verifying...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  Sign In
                </span>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500 font-light">
              New to Eternal Attires?{' '}
              <Link 
                to={redirect ? `/register?redirect=${redirect}` : '/register'} 
                className="font-black text-black hover:text-primary-500 transition-colors uppercase tracking-widest ml-1"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
