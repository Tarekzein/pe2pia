import apiClient from '../../../services/apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const notificationsService = {
    async fetchNotifications() {
        const userId = await AsyncStorage.getItem('userId');
        return apiClient.get(`/notifications/${userId}`);
    },
    async markAsRead(notificationId: number) {
        return apiClient.patch(`/notifications/${notificationId}`);
    },
};

export default notificationsService;
