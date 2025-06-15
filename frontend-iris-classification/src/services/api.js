import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log('Making API request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API response received:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - please check if the Flask server is running');
    }
    
    if (error.code === 'ERR_NETWORK') {
      throw new Error('Network error - unable to connect to Flask server on port 5000');
    }
    
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.error || `Server error: ${error.response.status}`;
      throw new Error(message);
    }
    
    throw new Error('Failed to connect to prediction service');
  }
);

export const predictSpecies = async (features) => {
  try {
    const response = await api.post('/predict', {
      features
    });
    // console.log(response.data)
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};

export default api;