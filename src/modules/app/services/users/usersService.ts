import apiClient from '../../../../services/apiClient';

const usersService = {
    async fetchUser(id: string) {
        return apiClient.get(`/admin/${id}`);
    },
};

export default usersService;