import apiClient from '../../../services/apiClient';

const searchService = {
  async search(search: string) {
    return apiClient.get('/users/search', {
      params: {
        query: search,
      },
    });
  },
};

export default searchService;