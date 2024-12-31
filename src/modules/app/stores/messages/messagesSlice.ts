import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../../../store'; // Ensure the path to your store is correct
import messagesService from '../../services/messagesService';
import usersService from '../../services/users/usersService';

interface User {
    _id: string;
    FirstName: string;
    LastName: string;
    email: string;
    bio: string;
    profilePicture: { url: string; public_id: string };
    role: string;
    story: string;
    followers: string[];
    following: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
    posts: any[];
}

interface Chat {
    _id: string;
    members: User[];
    createdAt: string;
    updatedAt: string;
}

interface MessagesState {
    chats: Chat[];
    messages: any[];
    loading: boolean;
    error: any;
}

const initialState: MessagesState = {
    chats: [],
    messages: [],
    loading: false,
    error: null,
};

export const fetchChats = createAsyncThunk<
    Chat[],
    string,
    { rejectValue: string }
>(
    'messages/fetchChats',
    async (id, { rejectWithValue }) => {
        try {
            const response = await messagesService.fetchChats(id);
            const fetchedChats = response.data;

            // Fetch user details for each member in each chat
            const chatsWithUserDetails = await Promise.all(
              fetchedChats.map(async (chat: {members: any[]}) => {
                // @ts-ignore
                const membersWithDetails = await Promise.all(
                  chat.members.map(async memberId => {
                    const response = await usersService.fetchUser(memberId);
                    return response.data.data.user;
                  }),
                );
                return {...chat, members: membersWithDetails};
              }),
            );

            return chatsWithUserDetails;

        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchMessages = createAsyncThunk(
    'messages/fetchMessages',
    async (_, { rejectWithValue }) => {
        try {
            const response = await messagesService.fetchMessages();
            return response.data.data; // Assuming your API returns a `data` field
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const sendMessage = createAsyncThunk(
    'messages/sendMessage',
    async (message: string, { rejectWithValue }) => {
        try {
            const response = await messagesService.sendMessage(message);
            return response.data.data; // Assuming your API returns a `data` field
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        clearMessages(state) {
            state.messages = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchChats.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.chats = [];
            })
            .addCase(fetchChats.fulfilled, (state, action) => {
                state.loading = false;
                state.chats = action.payload;
            })
            .addCase(fetchChats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.messages = [];
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.loading = false;
                state.messages = action.payload;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(sendMessage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.loading = false;
                state.messages.push(action.payload);
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearMessages } = messagesSlice.actions;
export const selectMessagesState = (state: RootState) => state.messages;
export default messagesSlice.reducer;