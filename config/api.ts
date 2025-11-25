// Get the local IP address for development
// For iOS simulator: use your Mac's local IP address (e.g., 192.168.1.x or 10.0.x.x)
// For Android emulator: use 10.0.2.2
// For physical devices: use your Mac's local IP address on the same network

export const API_CONFIG = {
  // Change this to your Mac's local IP address when testing on a device
  BASE_URL: 'http://localhost:8080/api/v1',
  WS_URL: 'ws://localhost:8080/ws',
  TIMEOUT: 10000,
};

// Helper to get the correct API URL based on the environment
export const getApiUrl = () => {
  // In production, you would use your deployed backend URL
  if (__DEV__) {
    return API_CONFIG.BASE_URL;
  }
  return 'https://your-production-api.com/api/v1';
};
