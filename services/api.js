import axios from 'axios';

// Check if window is defined (client-side)
const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : undefined,  
  },
});

export default api;


