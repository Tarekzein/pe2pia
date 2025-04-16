import apiClient from '../../../../services/apiClient';

const usersService = {
    async fetchUser(id: string) {
        return apiClient.get(`/admin/${id}`);
    },
    async followUser(data: any) {
        return apiClient.post(`/users/follow`, data);

    },
    async unfollowUser(data: any) {
        return apiClient.post(`/users/unFollow`, data);
    },
};

export default usersService;
