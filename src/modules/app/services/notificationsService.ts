import apiClient from '../../../services/apiClient';

const notificationsService = {
    async fetchNotifications() {
        return apiClient.get('/notifications');
    },
    async markAsRead(notificationId: number) {
        return apiClient.patch(`/notifications/${notificationId}`);
    },
};

export default notificationsService;