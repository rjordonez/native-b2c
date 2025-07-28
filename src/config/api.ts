// API Configuration
// Centralized API URL configuration

// Get the base API URL from environment variable
// In production, this should be '/api' for same-origin requests
// In development, this can be the full URL to the backend server
export const API_BASE_URL = import.meta.env.VITE_API_URL || (
  import.meta.env.DEV ? 'http://localhost:3001/api' : '/api'
);