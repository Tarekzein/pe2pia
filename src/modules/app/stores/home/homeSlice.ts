import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../store'; // Ensure the path to your store is correct
import homeService from '../../services/homeService';

interface HomeState {
    posts: any[];
    postComments: any;
    fetchPostsLoading: boolean;
    createPostLoading: boolean;
    createPostError: any;
    fetchCommentsLoading: boolean;
    error: any;
}

const initialState: HomeState = {
    posts: [],
    postComments: null,
    fetchPostsLoading: false,
    createPostLoading: false,
    createPostError: null,
    fetchCommentsLoading: false,
    error: null,
};


// Async thunk for fetching posts
export const fetchPosts = createAsyncThunk(
    'home/fetchPosts',
    async (category:any, { rejectWithValue }) => {
        try {
            const response = await homeService.fetchPosts(category);
            return response.data.data; // Assuming your API returns a `data` field
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
export const createPost = createAsyncThunk(
    'home/createPost',
    async (post: any, { rejectWithValue }) => {
        try {
            const response = await homeService.createPost(post);
            if (response.data.status === 'error') {
                return rejectWithValue(response.data.message);
            }
            return response.data.data.post; // Assuming your API returns a `data` field
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);
export const likePost = createAsyncThunk(
    'home/likePost',
    async (postId: string, { rejectWithValue }) => {
        try {
            const response = await homeService.likePost(postId);
            return response.data.data.post; // Assuming your API returns a `data` field
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchPostComments = createAsyncThunk(
    'home/fetchPostComments',
    async (postId: string, { rejectWithValue }) => {
        try {
            const response = await homeService.getPostComments(postId);
            let data = response.data.data;
            data.postId = postId;
            return data; // Assuming your API returns a `data` field
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const addComment = createAsyncThunk(
    'home/addComment',
    async ({ postId, comment }: any, { rejectWithValue }) => {
        try {
            const response = await homeService.addComment(postId, comment);
            let data = response.data.data;
            data.postId = postId;
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Posts
            .addCase(fetchPosts.pending, (state) => {
                state.fetchPostsLoading = true;
                state.error = null;
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.posts = action.payload.posts;
                state.fetchPostsLoading = false;
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.fetchPostsLoading = false;
                state.error = action.payload;
            })
            .addCase(createPost.pending, (state) => {
                state.createPostLoading = true;
                state.createPostError = null;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.createPostLoading = false;
                // state.posts.unshift(action.payload);
            })
            .addCase(createPost.rejected, (state, action) => {
                state.createPostLoading = false;
                state.createPostError = action.payload;
            })
            // Like Post
            .addCase(likePost.pending, (state) => {
                state.error = null;
            })
            .addCase(likePost.fulfilled, (state, action) => {
                const post = state.posts.find((post) => post._id === action.payload._id);
                if (post) {
                    post.likes = action.payload.likes;
                }
            })
            .addCase(likePost.rejected, (state, action) => {
                state.error = action.payload;
            })

            // Fetch Post Comments
            .addCase(fetchPostComments.pending, (state) => {
                state.postComments = [];
                state.fetchCommentsLoading = true;
                state.error = null;
            })
            .addCase(fetchPostComments.fulfilled, (state, action) => {
                const post = state.posts.find((post) => post._id === action.payload.postId);
                if (post) {
                    post.comments = action.payload.comments;
                    state.postComments = post.comments;
                }
                state.fetchCommentsLoading = false;
            })
            .addCase(fetchPostComments.rejected, (state, action) => {
                state.error = action.payload;
                state.fetchCommentsLoading = false;
            })
            .addCase(addComment.fulfilled, (state, action) => {
                const post = state.posts.find((post) => post._id === action.payload.postId);
                if (post) {
                    post.comments.push(action.payload.comment);
                    state.postComments = post.comments;
                    console.log(post.comments);
                }
            })
            .addCase(addComment.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

// Selector to get the home state
export const selectHomeState = (state: RootState) => state.home;

// Export the reducer to be added to the store
export default homeSlice.reducer;
