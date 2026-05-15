import api from '../api/axiosConfig';

// Authentication
export const login = (credentials) => api.post('/api/users/login', credentials);
export const register = (userData) => api.post('/api/users/register', userData);
export const logout = () => api.post('/api/users/logout');
export const getProfile = () => api.get('/api/users/profile');
export const updateProfile = (userData) => api.put('/api/users/profile', userData);

// Products
export const fetchProducts = (params) => api.get('/api/products', { params });
export const fetchProductById = (id) => api.get(`/api/products/${id}`);
export const createProductReview = (id, review) => api.post(`/api/products/${id}/reviews`, review);

// Wishlist
export const getWishlist = () => api.get('/api/users/wishlist');
export const toggleWishlist = (productId) => api.post('/api/users/wishlist', { productId });

// Orders
export const createOrder = (orderData) => api.post('/api/orders', orderData);
export const getMyOrders = () => api.get('/api/orders/myorders');
export const getOrderDetails = (id) => api.get(`/api/orders/${id}`);

// Payments
export const createRazorpayOrder = (amount) => api.post('/api/payments/razorpay/order', { amount });
export const verifyRazorpayPayment = (paymentData) => api.post('/api/payments/razorpay/verify', paymentData);

// Admin
export const getAllUsers = () => api.get('/api/users');
export const getAllOrders = () => api.get('/api/orders');
export const adminCreateProduct = (productData) => api.post('/api/products', productData);
export const adminUpdateProduct = (id, productData) => api.put(`/api/products/${id}`, productData);
export const adminDeleteProduct = (id) => api.delete(`/api/products/${id}`);
export const adminDeliverOrder = (id) => api.put(`/api/orders/${id}/deliver`);
