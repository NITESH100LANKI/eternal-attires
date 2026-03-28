import axios from 'axios';

const BASE_URL = "https://eternal-attires.onrender.com";

// Dynamically sets the base URL.
// In development, it defaults to localhost:5000.
// In production (Vercel), you must set REACT_APP_API_URL to your Render backend URL.
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || (process.env.REACT_APP_API_URL || '${BASE_URL}') + '',
  withCredentials: true,
});

export default api;
