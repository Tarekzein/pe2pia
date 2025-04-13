import apiClient from '../../../services/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const profileService = {
  async getProfile() {
    return apiClient.get('/profile');
  },
  async updateProfile(data: any) {
    const userId = await AsyncStorage.getItem('userId');
    console.log('userId:', userId);
    return apiClient.patch(`/users/${userId}`, data);
  },

  async updateProfileImage(data: any) {
    const userId = await AsyncStorage.getItem('userId');
    console.log('userId:', userId);
    console.log('updateProfileImage data:', data);
    return apiClient.post(`/admin/profile-photo-upload`, data,{
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default profileService;
