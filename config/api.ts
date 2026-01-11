// Get the local IP address for development
// For iOS simulator: use your Mac's local IP address (e.g., 192.168.1.x or 10.0.x.x)
// For Android emulator: use 10.0.2.2
// For physical devices: use your Mac's local IP address on the same network

export const API_CONFIG = {
  // For iOS Simulator, use your Mac's local IP address
  // Find it by running: ipconfig getifaddr en0 (WiFi) or ipconfig getifaddr en1 (Ethernet)
  BASE_URL: 'http://192.168.0.207:8080/api/v1',
  WS_URL: 'ws://192.168.0.207:8080/ws',
  TIMEOUT: 10000,
};

// Helper to get the correct API URL based on the environment
export const getApiUrl = () => {
  if (__DEV__) {
    return API_CONFIG.BASE_URL;
  }
  return 'https://your-production-api.com/api/v1';
};
