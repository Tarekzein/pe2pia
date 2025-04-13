import apiClient from '../../../services/apiClient';

const homeService = {
  async fetchPosts(category: void) {
    return apiClient.get('/posts/getAllPosts', {
      params: {
        category: category,
      },
    });
  },
    async createPost(post: any) {
        console.log('post from service',post);
        return apiClient.post('/posts/createPost', post, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

    },
  async deletePost(postId: string) {
    return apiClient.delete('/posts/' + postId);
  },
  async likePost(postId: string) {
    return apiClient.put('/posts/like/' + postId);
  },
  async getPostComments(postId: string) {
    return apiClient.get('/posts/comments/' + postId);
  },
    async addComment(postId: string, comment: string) {
        return apiClient.post('/comments' , {
            postId: postId,
            text: comment,
        });
    },
};

export default homeService;
