import apiClient from '../../../services/apiClient';

const messagesService = {
    async fetchChats(id: string) {
        return apiClient.get(`/conversation/${id}`);
    },
    async fetchMessages() {
        return apiClient.get('/messages');
    },
    async sendMessage(message: string) {
        return apiClient.post('/messages', { message });
    },
};

export default messagesService;