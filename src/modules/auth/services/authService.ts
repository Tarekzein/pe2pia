import apiClient from '../../../services/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const authService = {
    login: async (email: string, password: string) => {
      try {
        const response = await apiClient.post('/users/login', { email, password });

        // Check if the response is valid
        if (response && response.data && response.data.data) {
          const token = response.data.data.token;

          // Store the token in AsyncStorage
          await AsyncStorage.setItem('token', token);

          // Return the extracted user data
          return response.data.data;
        }

        throw new Error('Unexpected response structure');
      } catch (error: any) {
        // Handle Axios error response
        if (error.response) {

          // Throw a specific error message
          throw error.response.data;
        } else {
          // Log unexpected errors (e.g., network issues)
          throw new Error('An unexpected error occurred. Please try again.');
        }
      }
    },
  register: async (email:string, firstName: string, lastName: string , password:string) => {
    const response = await apiClient.post('/users/register', {
     email: email,
     FirstName: firstName,
     LastName: lastName,
     password: password,
    });
    // Store the token and user data in localStorage
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
