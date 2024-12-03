import apiClient from '../../../services/apiClient';

const homeService = {
    async fetchPosts() {
        return apiClient.get('/posts/getAllPosts');
    },
};

export default homeService;
