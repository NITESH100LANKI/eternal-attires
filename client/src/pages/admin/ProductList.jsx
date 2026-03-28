import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Loader from '../../components/Loader';

const BASE_URL = "https://eternal-attires.onrender.com";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/products`);
      setProducts(data);
    } catch (error) {
      toast.error('Failed to fetch products');
    }
    setLoading(false);
  };

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${BASE_URL}/api/products/${id}`, { withCredentials: true });
        toast.success('Product deleted successfully');
        fetchProducts(); // refresh
      } catch (err) {
        toast.error('Failed to delete product');
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800 uppercase tracking-wider">Products</h1>
        <Link
          to="/admin/product/new"
          className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded shadow flex items-center gap-2 transition"
        >
          <FaPlus /> Create Product
        </Link>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-x-auto border border-gray-100">
        <table className="w-full whitespace-nowrap">
          <thead className="bg-gray-50 border-b border-gray-200 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Brand</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {products.map((product) => (
              <tr key={product._id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-gray-500">{product._id.substring(0, 10)}...</td>
                <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                <td className="px-6 py-4">Rs. {product.price}</td>
                <td className="px-6 py-4">{product.category}</td>
                <td className="px-6 py-4">{product.brand}</td>
                <td className="px-6 py-4 font-medium text-center space-x-4">
                  <Link to={`/admin/product/${product._id}/edit`} className="text-indigo-600 hover:text-indigo-900 inline-block">
                    <FaEdit className="w-4 h-4" />
                  </Link>
                  <button onClick={() => deleteHandler(product._id)} className="text-red-500 hover:text-red-700 inline-block">
                    <FaTrash className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
