import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {RootState} from '../../../store'; // Ensure the path to your store is correct
import searchService from '../../services/profileService';
import usersService from '../../services/users/usersService.ts';
import { updateUser,updateUserProfile } from '../../../auth/stores/authSlice'; // Import updateUser action

interface ProfileState {
    profile: any;
    userPosts: any;
    userFollowers: any;
    userFollowing: any;
    loading: boolean;
    error: any;
}

const initialState: ProfileState = {
    profile: null,
    userPosts: [],
    userFollowers: [],
    userFollowing: [],
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

export const updateProfileImage = createAsyncThunk(
  'profile/updateProfileImage',
  async (data: any, { rejectWithValue, dispatch }) => {
      try {
          const response = await searchService.updateProfileImage(data);
          dispatch(updateUserProfile(response.data.profilePhotos[0])); // Dispatch updateUser here
          return response.data.data;
      } catch (error: any) {
          return rejectWithValue(error.response?.data || error.message);
      }
  }
);

export const fetchUserPosts = createAsyncThunk(
    'profile/fetchUserPosts',
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await searchService.getUserPosts(userId);
            return response.data.data.posts; // Assuming your API returns a `data` field
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchUserFollowers = createAsyncThunk(
    'profile/fetchUserFollowers',
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await usersService.fetchUserFollowers(userId);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchUserFollowing = createAsyncThunk(
    'profile/fetchUserFollowing',
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await usersService.fetchUserFollowing(userId);
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
            })
            .addCase(updateProfileImage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProfileImage.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(updateProfileImage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchUserPosts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserPosts.fulfilled, (state, action) => {
                state.loading = false;
                state.userPosts = action.payload;
            })
            .addCase(fetchUserPosts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchUserFollowers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserFollowers.fulfilled, (state, action) => {
                state.loading = false;
                state.userFollowers = action.payload;
            })
            .addCase(fetchUserFollowers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchUserFollowing.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserFollowing.fulfilled, (state, action) => {
                state.loading = false;
                state.userFollowing = action.payload;
            })
            .addCase(fetchUserFollowing.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearProfile } = profileSlice.actions;

export const selectProfileState = (state: RootState) => state.profile;

export default profileSlice.reducer;
