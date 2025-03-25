import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {RootState, store} from '../../../store'; // Ensure the path to your store is correct
import searchService from '../../services/profileService';
import { updateUser } from '../../../auth/stores/authSlice'; // Import updateUser action

interface ProfileState {
    profile: any;
    loading: boolean;
    error: any;
}

const initialState: ProfileState = {
    profile: null,
    loading: false,
    error: null,
};

export const fetchProfile = createAsyncThunk(
    'profile/fetchProfile',
    async (_, { rejectWithValue }) => {
        try {
            const response = await searchService.getProfile();
            return response.data.data; // Assuming your API returns a `data` field
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (data: any, { rejectWithValue, dispatch }) => {
      try {
          const response = await searchService.updateProfile(data);
          dispatch(updateUser(response.data.data.user)); // Dispatch updateUser here
          return response.data.data;
      } catch (error: any) {
          return rejectWithValue(error.response?.data || error.message);
      }
  }
);
const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        clearProfile(state) {
            state.profile = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profile = action.payload;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.profile = action.payload;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearProfile } = profileSlice.actions;

export const selectProfileState = (state: RootState) => state.profile;

export default profileSlice.reducer;
