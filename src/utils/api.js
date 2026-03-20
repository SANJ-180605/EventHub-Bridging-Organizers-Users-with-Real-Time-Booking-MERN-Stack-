import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add request interceptor to include token in every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  console.log('🔑 Token from localStorage:', token ? 'Exists' : 'MISSING');
  
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
    console.log('✅ Token added to headers');
  } else {
    console.log('❌ No token found in localStorage');
  }
  
  console.log('🔄 API Request:', req.method, req.url);
  return req;
});

// Enhanced response interceptor for better error handling
API.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.data.message || 'Success');
    return response;
  },
  (error) => {
    console.log('❌ API Error:', {
      status: error.response?.status,
      message: error.response?.data?.error || error.response?.data?.message || error.message,
      url: error.config?.url
    });
    
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      console.log('🚨 Unauthorized access - redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Add response interceptor for better error logging
API.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.data.message);
    return response;
  },
  (error) => {
    console.log('❌ API Error:', error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default API;