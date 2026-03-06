import axios from 'axios';

// Check if window is defined (client-side)
const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
 
});

api.interceptors.request.use(
  (config) => {
    // Don't override if Authorization header is already manually set
    if (!config.headers.Authorization) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
)

export default api;


