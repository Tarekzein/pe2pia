import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../store'; // Ensure the path to your store is correct
import notificationsService from '../../services/notificationsService';

interface NotificationsState {
    notifications: any[];
    loading: boolean;
    error: any;
}

const initialState: NotificationsState = {
    notifications: [],
    loading: false,
    error: null,
};

export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async (_, { rejectWithValue }) => {
        try {
            const response = await notificationsService.fetchNotifications();
            return response.data.data; // Assuming your API returns a `data` field
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const markAsRead = createAsyncThunk(
    'notifications/markAsRead',
    async (notificationId: number, { rejectWithValue }) => {
        try {
            const response = await notificationsService.markAsRead(notificationId);
            return response.data.data; // Assuming your API returns a `data` field
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        clearNotifications(state) {
            state.notifications = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.notifications = [];
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(markAsRead.fulfilled, (state, action) => {
                const notificationId = action.payload.id;
                state.notifications = state.notifications.map((notification) => {
                    if (notification.id === notificationId) {
                        return {
                            ...notification,
                            read: true,
                        };
                    }
                    return notification;
                });
            });
    },
});

export const { clearNotifications } = notificationsSlice.actions;
export const selectNotificationsState = (state: RootState) => state.notifications;
export default notificationsSlice.reducer;

