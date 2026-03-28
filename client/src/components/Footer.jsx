import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-10 pb-6 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold tracking-wider text-primary-500 mb-4">ETERNAL ATTIRES</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Discover the latest fashion trends and premium quality clothing for everyone. Your ultimate fashion destination.
            </p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4 text-gray-100">ONLINE SHOPPING</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-primary-400 transition">Men</Link></li>
              <li><Link to="/" className="hover:text-primary-400 transition">Women</Link></li>
              <li><Link to="/" className="hover:text-primary-400 transition">Kids</Link></li>
              <li><Link to="/" className="hover:text-primary-400 transition">Beauty</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4 text-gray-100">CUSTOMER POLICIES</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-primary-400 transition">Contact Us</Link></li>
              <li><Link to="/" className="hover:text-primary-400 transition">FAQ</Link></li>
              <li><Link to="/" className="hover:text-primary-400 transition">T&C</Link></li>
              <li><Link to="/" className="hover:text-primary-400 transition">Terms Of Use</Link></li>
              <li><Link to="/" className="hover:text-primary-400 transition">Track Orders</Link></li>
              <li><Link to="/" className="hover:text-primary-400 transition">Shipping</Link></li>
              <li><Link to="/" className="hover:text-primary-400 transition">Cancellation</Link></li>
              <li><Link to="/" className="hover:text-primary-400 transition">Returns</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4 text-gray-100">EXPERIENCE MATTERS</h4>
            <div className="flex space-x-4 mt-4">
              {/* Dummy app store badges */}
              <div className="bg-gray-800 p-2 rounded cursor-pointer border border-gray-700 hover:border-primary-500 transition">
                <span className="text-xs block text-gray-400">GET IT ON</span>
                <span className="text-sm font-bold">Google Play</span>
              </div>
              <div className="bg-gray-800 p-2 rounded cursor-pointer border border-gray-700 hover:border-primary-500 transition">
                <span className="text-xs block text-gray-400">Download on the</span>
                <span className="text-sm font-bold">App Store</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 mt-6 text-center md:flex md:justify-between md:text-left">
          <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} Eternal Attires. All rights reserved.</p>
          <div className="mt-4 md:mt-0 space-x-4">
            <span className="text-sm text-gray-400 font-bold">100% ORIGINAL</span> guarantee
            <span className="text-sm text-gray-400 font-bold ml-4">Return within 14 days</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
