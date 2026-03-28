import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader';

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'new';

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('Men');
  const [stock, setStock] = useState(0);
  const [description, setDescription] = useState('');
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(!isNew);

  useEffect(() => {
    if (!isNew) {
      const fetchProduct = async () => {
        try {
          const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
          setName(data.name);
          setPrice(data.price);
          setDiscountPrice(data.discountPrice || 0);
          setBrand(data.brand);
          setCategory(data.category);
          setStock(data.stock);
          setDescription(data.description);
          setImages(data.images || []);
          setSizes(data.sizes || []);
          setLoading(false);
        } catch (error) {
          toast.error('Product not found');
          navigate('/admin/productlist');
        }
      };
      fetchProduct();
    }
  }, [id, isNew, navigate]);

  const uploadFileHandler = async (e) => {
    const files = e.target.files;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
    }
    setUploading(true);
    try {
      const { data } = await axios.post((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/upload', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImages([...images, ...data.images]);
      toast.success('Images Uploaded successfully!');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Upload failed');
    }
    setUploading(false);
  };

  const removeImageHandler = (public_id) => {
      setImages(images.filter(img => img.public_id !== public_id));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name, price, discountPrice, images, brand, category, stock, sizes, description
      };

      if (isNew) {
        await axios.post((process.env.REACT_APP_API_URL || 'http://localhost:5000') + '/api/products', payload, { withCredentials: true });
        toast.success('Product created');
      } else {
        await axios.put(`http://localhost:5000/api/products/${id}`, payload, { withCredentials: true });
        toast.success('Product updated');
      }
      navigate('/admin/productlist');
    } catch (error) {
      toast.error('Server error saving product');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-8 text-gray-800 uppercase tracking-wider">
        {isNew ? 'Create Product' : 'Edit Product'}
      </h1>

      <form onSubmit={submitHandler} className="bg-white p-6 shadow-sm rounded-lg border border-gray-100 space-y-6">
        
        {/* Name and Brand */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
             <input type="text" className="w-full border border-gray-300 rounded p-2 focus:ring-primary-500" value={name} onChange={(e) => setName(e.target.value)} required />
           </div>
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
             <input type="text" className="w-full border border-gray-300 rounded p-2 focus:ring-primary-500" value={brand} onChange={(e) => setBrand(e.target.value)} required />
           </div>
        </div>

        {/* Pricing & Stock */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Price (Rs)</label>
             <input type="number" className="w-full border border-gray-300 rounded p-2 focus:ring-primary-500" value={price} onChange={(e) => setPrice(Number(e.target.value))} required />
           </div>
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Discount Price (Rs)</label>
             <input type="number" className="w-full border border-gray-300 rounded p-2 focus:ring-primary-500" value={discountPrice} onChange={(e) => setDiscountPrice(Number(e.target.value))} />
           </div>
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
             <input type="number" className="w-full border border-gray-300 rounded p-2 focus:ring-primary-500" value={stock} onChange={(e) => setStock(Number(e.target.value))} required />
           </div>
        </div>

        {/* Category & Sizes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
             <select className="w-full border border-gray-300 rounded p-2 focus:ring-primary-500" value={category} onChange={(e) => setCategory(e.target.value)}>
               <option value="Men">Men</option>
               <option value="Women">Women</option>
               <option value="Kids">Kids</option>
             </select>
           </div>
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">Sizes (comma separated)</label>
             <input 
               type="text" 
               className="w-full border border-gray-300 rounded p-2 focus:ring-primary-500" 
               value={sizes.join(',')} 
               onChange={(e) => setSizes(e.target.value.split(',').map(s => s.trim()))} 
               placeholder="S, M, L, XL"
             />
           </div>
        </div>

        {/* Image Upload Area via Cloudinary */}
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Product Images (Cloudinary)</label>
           <input type="file" multiple accept="image/*" onChange={uploadFileHandler} className="w-full border border-gray-300 rounded p-1 mb-2 text-sm text-gray-500 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" />
           {uploading && <Loader />}
           
           <div className="flex flex-wrap gap-4 mt-4">
             {images.map((img) => (
                <div key={img.public_id} className="relative w-24 h-24 border rounded overflow-hidden">
                   <img src={img.url} alt="product preview" className="w-full h-full object-cover" />
                   <button type="button" onClick={() => removeImageHandler(img.public_id)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">x</button>
                </div>
             ))}
           </div>
        </div>

        {/* Description */}
        <div>
           <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
           <textarea rows="4" className="w-full border border-gray-300 rounded p-2 focus:ring-primary-500" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>

        <button type="submit" className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 rounded shadow mt-6 uppercase tracking-wider">
           {isNew ? 'Publish Product' : 'Update Product'}
        </button>
      </form>
    </div>
  );
};

export default ProductEdit;
