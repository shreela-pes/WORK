import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Add axios interceptor for auth header
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
    }
    return response.data.user;
  } catch (error) {
    throw error.response.data;
  }
};

export const signup = async (name, email, password, phone) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, { name, email, password, phone });
    if (response.data.token) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

export const getCurrentUser = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    
    // Try to get fresh data from API
    const response = await axios.get(`${API_URL}/customer/me`);
    return response.data.user;
  } catch (error) {
    // Fallback to stored user data if API call fails
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};