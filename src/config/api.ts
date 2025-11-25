// API Configuration
// Centralized API URL configuration

// Get the base API URL from environment variable
// In production, this should be '/api' for same-origin requests
// In development, this can be the full URL to the backend server
// For network access, replace localhost with the current hostname
const getApiUrl = () => {
  // Check for environment variable first
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // In development, use the current hostname if not localhost
  if (import.meta.env.DEV) {
    const hostname = window.location.hostname;
    
    // Handle Cloudflare tunnel (uses HTTPS)
    if (hostname.includes('trycloudflare.com')) {
      // Use relative path so it goes through Vite's proxy
      return '/api';
    }
    
    // If accessing from network IP, use that for API too
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `http://${hostname}:3001/api`;
    }
    return 'http://localhost:3001/api';
  }
  
  // Production
  return '/api';
};

export const API_BASE_URL = getApiUrl();