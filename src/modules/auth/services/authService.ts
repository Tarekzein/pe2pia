import apiClient from '../../../services/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      // Store the token and user data in localStorage
      await  AsyncStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error: any) {
      // You could add specific error parsing here if needed
      console.log('error', error.response?.data?.message);
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },
  register: async (email:string, name:string, password:string) => {
    const response = await apiClient.post('/auth/register', { email,name, password,password_confirmation:password });
    // Store the token and user data in localStorage
    await AsyncStorage.setItem('token', response.data.token);
    return response.data;
  },
  logout: async () => {
    await apiClient.post('/auth/logout');
    // Remove the token and user data from localStorage
    await AsyncStorage.removeItem('token');
  },
  forgotPassword: async (email: string) => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },
  verifyOtp: async (email: string, otp: string) => {
    const response = await apiClient.post('/auth/verify-otp', { email, otp });
    return response.data;
  },
  resetPassword: async (email: string, password: string, password_confirmation: string) => {
    const response = await apiClient.post('/auth/reset-password', { email, password, password_confirmation });
    return response.data;
  },
};

export default authService;
