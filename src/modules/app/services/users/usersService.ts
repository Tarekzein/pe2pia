import apiClient from '../../../../services/apiClient';

const usersService = {
    async fetchUser(id: string) {
        return apiClient.get(`/admin/${id}`);
    },
    async toggleFollow(data: any) {
        return apiClient.post(`/users/follow`, data);

    },
    async fetchUserFollowers(id: string) {
        return apiClient.get(`/users/followers/${id}`);
    },
    async fetchUserFollowing(id: string) {
        return apiClient.get(`/users/following/${id}`);
    },
};

export default usersService;
