import apiClient from '../../../services/apiClient';

const messagesService = {
  async fetchChats(id: string) {
    return apiClient.get(`/conversation/${id}`);
  },
  async fetchMessages(id: string) {
    return apiClient.get(`/message/${id}`);
  },
  async sendMessage(data: any) {
    return apiClient.post('/message', data,{
        headers: {
            'Content-Type': 'multipart/form-data',
        },
      });
  },
  async createConversation(data: any) {
    return apiClient.post('/conversation', data);
  }
};

export default messagesService;
