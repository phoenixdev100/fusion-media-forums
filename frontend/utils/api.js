import axios from 'axios';

// Create an axios instance with the backend API URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor to include auth token when available
api.interceptors.request.use(
  config => {
    // Check if we have a token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Set token in both headers to ensure compatibility
      config.headers['x-auth-token'] = token;
      config.headers['Authorization'] = `Bearer ${token}`;
      
      // Log token presence for debugging (remove in production)
      console.log('API Request with token:', {
        url: config.url,
        method: config.method,
        hasToken: !!token
      });
    }
    
    // Log all outgoing requests for debugging
    // console.log('Outgoing request:', {
    //   url: config.url,
    //   method: config.method,
    //   data: config.data ? JSON.stringify(config.data).substring(0, 100) : 'No data'
    // });
    
    return config;
  },
  error => {
    console.error('API Request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  response => {
    // Log successful responses
    // console.log('API Response success:', {
    //   url: response.config.url,
    //   status: response.status
    // });
    return response;
  },
  error => {
    // Handle specific error cases
    if (error.response) {
      // Server responded with a status code outside of 2xx range
      console.error('API Error:', {
        url: error.config?.url,
        status: error.response.status,
        data: error.response.data,
        message: error.message
      });
      
      // Special handling for login errors
      if (error.config?.url.includes('/login')) {
        console.error('Login request failed:', {
          requestData: JSON.parse(error.config?.data || '{}'),
          responseError: error.response?.data
        });
      }
      
      // Handle unauthorized errors (token expired, etc.)
      if (error.response.status === 401) {
        // Clear auth data and redirect to login if needed
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // If we're not already on the login page, redirect
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Error: No response received', {
        url: error.config?.url,
        method: error.config?.method
      });
      console.error('No response received:', error.request);
    } else {
      // Something else happened in setting up the request
      console.error('Error setting up request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
