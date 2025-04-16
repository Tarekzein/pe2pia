import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../store'; // Update the path if your store is located elsewhere
import authService from '../services/authService';

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: any;
  user: any; // Define a proper user type if possible
  token:string | null;
  forgotPasswordEmail: string;
}

// Initial state for auth
const initialState: AuthState = {
  isAuthenticated: false, // Check if token exists in localStorage
  loading: false,
  error: null,
  user: null, // Retrieve user from localStorage
  token: null, // Retrieve token from localStorage
  forgotPasswordEmail: '',
};


// Async thunk for login
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const data = await authService.login(email, password);
      return data; // Return data for fulfilled case
    } catch (error: any) {
      console.log('login error: ', error);
      return rejectWithValue(error); // Handle errors by rejecting with a value
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ email,firstName, lastName, password }: { email: string; password: string; firstName: string; lastName: string }, { rejectWithValue }) => {
    try {
      const data = await authService.register(email, firstName,lastName, password);
      return data; // Return data for fulfilled case
    } catch (error: any) {
      console.log('register error: ', error.message);
      return rejectWithValue(error.message); // Handle errors by rejecting with a value
    }
  }
);
// Async thunk for logout
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      console.log('logout successful');
      return; // Return nothing for fulfilled case
    } catch (error: any) {
      console.log('logout error: ', error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async ({ email }: { email: string }, { rejectWithValue }) => {
    try {
      const data = await authService.forgotPassword(email);
      return data; // Return data for fulfilled case
    } catch (error: any) {
      console.log('forgotPassword error: ', error.message);
      return rejectWithValue(error.message); // Handle errors by rejecting with a value
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/confirmOtp',
  async ({ email, otp }: { email: string; otp: string }, { rejectWithValue }) => {
    try {
      const data = await authService.verifyOtp(email, otp);
      return data; // Return data for fulfilled case
    } catch (error: any) {
      console.log('confirmOtp error: ', error.message);
      return rejectWithValue(error.message); // Handle errors by rejecting with a value
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ email, password, password_confirmation }: { email: string; password: string; password_confirmation: string }, { rejectWithValue }) => {
    try {
      const data = await authService.resetPassword(email, password, password_confirmation);
      return data; // Return data for fulfilled case
    } catch (error: any) {
      console.log('resetPassword error: ', error.message);
      return rejectWithValue(error.message); // Handle errors by rejecting with a value
    }
  }
);

// Create auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    updateUser(state, action) {
      state.user = action.payload;
    },
    updateUserProfile(state, action) {
      state.user.profilePicture.url = action.payload.url;
      state.user.profilePicture.public_id = action.payload.public_id;
    },
    updateUserFollowing(state, action) {
      // Check if the ID already exists in the following array
      const isAlreadyFollowing = state.user.following.some(
        (following: any) => following === action.payload,
      );

      if (!isAlreadyFollowing) {
        // Add the new ID to the following array
        state.user.following.push(action.payload);
      }

      console.log('updateUserFollowing action.payload: ', action.payload);
      console.log(
        'updateUserFollowing state.user.following: ',
        state.user.following,
      );
    },

    // Optional: Add a separate reducer for unfollowing
    updateUnfollowUser(state, action) {
      state.user.following = state.user.following.filter(
        (following: any) => following !== action.payload,
      );

      console.log('unfollowUser action.payload: ', action.payload);
      console.log('unfollowUser state.user.following: ', state.user.following);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
        state.user = action.payload.userdata; // Store user data
        state.token = action.payload.token; // Store token
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(register.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        // state.isAuthenticated = true;
        state.loading = false;
        state.user = action.payload.user; // Store user data
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, state => {
        state.isAuthenticated = false;
        state.loading = false;
        state.user = null;
        state.token = null; // Clear token in state
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(forgotPassword.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.forgotPasswordEmail = action.payload.email;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyOtp.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, state => {
        state.loading = false;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(resetPassword.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, state => {
        state.loading = false;
        state.forgotPasswordEmail = '';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectCurrentUser = (state: RootState) => state.auth.user; // Selector for user data
export const selectToken = (state:RootState) => state.auth.token; // Selector for token
export const selectForgotPasswordEmail = (state: RootState) => state.auth.forgotPasswordEmail;
export const { updateUser,updateUserProfile,updateUserFollowing,updateUnfollowUser } = authSlice.actions;
export default authSlice.reducer;
