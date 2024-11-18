import apiClient from '../../../services/apiClient';

const userService = {
  getProfile: async () => {
    const response = await apiClient.get('/user/profile');
    return response.data;
  }
};

export default userService;
