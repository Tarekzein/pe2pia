import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../store'; // Ensure the path to your store is correct
import homeService from '../../services/homeService';

interface HomeState {
    posts: any[];
    loading: boolean;
    error: any;
}

const initialState: HomeState = {
    posts: [],
    loading: false,
    error: null,
};

// Async thunk for fetching posts
export const fetchPosts = createAsyncThunk(
    'home/fetchPosts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await homeService.fetchPosts();
            return response.data.data; // Assuming your API returns a `data` field
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
            .addCase(fetchPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.posts = action.payload.posts;
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Selector to get the home state
export const selectHomeState = (state: RootState) => state.home;

// Export the reducer to be added to the store
export default homeSlice.reducer;
