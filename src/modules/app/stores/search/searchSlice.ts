import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../store'; // Ensure the path to your store is correct
import searchService from '../../services/searchService';

interface SearchState {
    searchResults: any[];
    searchHistory: any[];
    loading: boolean;
    error: any;
}

const initialState: SearchState = {
    searchResults: [],
    searchHistory: [],
    loading: false,
    error: null,
};

export const fetchSearch = createAsyncThunk(
    'search/search',
    async (search: string, { rejectWithValue }) => {
        try {
            const response = await searchService.search(search);
            return response.data.data; // Assuming your API returns a `data` field
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        clearSearchResults(state) {
            state.searchResults = [];
        },
        clearSearchHistory(state) {
            state.searchHistory = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSearch.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSearch.fulfilled, (state, action) => {
                state.loading = false;
                state.searchResults = action.payload;
            })
            .addCase(fetchSearch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearSearchResults, clearSearchHistory } = searchSlice.actions;

// Selector to get the home state
export const selectSearchState = (state: RootState) => state.search;

// Export the reducer to be added to the store
export default searchSlice.reducer;