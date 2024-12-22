import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiClient = axios.create({
    baseURL: 'http://api.pe2pia.com:5000/api',
    headers: {
        // 'Content-Type': 'multipart/form-data',
    },
});

// Add a request interceptor to include the token in headers
apiClient.interceptors.request.use(
  async (config) => {
    // Await the retrieval of the token
    const token = await AsyncStorage.getItem('token'); // Await the promise
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);

export default apiClient;
