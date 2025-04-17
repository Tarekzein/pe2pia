import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
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
    unreadCount: number;
    _id: string;
    members: User[];
    lastMessage: any;
    createdAt: string;
    updatedAt: string;
}

interface Message {
    id: string;
    text: string;
    senderId: string;
    conversationId: string;
    createdAt: string;
    image?: string;
    status: 'sending' | 'sent' | 'failed';
}

interface MessagesState {
    chats: Chat[];
    messages: any[];
    following: any[];
    newConversation: any | null;
    loading: boolean;
    error: any;
}

const initialState: MessagesState = {
    chats: [],
    messages: [],
    following: [],
    newConversation: null,
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
    async (id:string, { rejectWithValue }) => {
        try {
            const response = await messagesService.fetchMessages(id);
            return response.data; // Assuming your API returns a `data` field
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// In messagesSlice.ts

export const sendMessage = createAsyncThunk<
    any,
    any,
    { rejectValue: string }
>(
    'messages/sendMessage',
    async (data, { dispatch, rejectWithValue }) => {
        const tempId = Math.random().toString(36); // Generate a random temporary ID

        // Create a local message with status 'sending'
        const localMessage: Message = {
            id: tempId,
            text: data.text,
            senderId: data.senderId,
            conversationId: data.conversationId,
            createdAt: new Date().toISOString(),
            image: data.image,
            status: 'sending',
        };

        // Add the message to the local state immediately
        dispatch(addLocalMessage(localMessage));

        try {
            // Send the message to the backend
            const response = await messagesService.sendMessage(data);
            const savedMessage = response.data; // Assuming the API returns the saved message with an _id

            // Update the message in the state with the real ID and status 'sent'
            dispatch(
                updateMessageStatus({
                    tempId,
                    newId: savedMessage._id,
                    status: 'sent',
                })
            );

            return savedMessage;
        } catch (error: any) {
            // If there was an error sending the message, update the status to 'failed'
            dispatch(
                updateMessageStatus({
                    tempId,
                    status: 'failed',
                })
            );
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchFollowing = createAsyncThunk(
    'messages/fetchFollowing',
    async (id:string, { rejectWithValue }) => {
        try {
            const response = await usersService.fetchUserFollowing(id);
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const createConversation = createAsyncThunk(
    'messages/createConversation',
    async (data: any, { rejectWithValue }) => {
        try {
            const response = await messagesService.createConversation(data);
            console.log('createConversation response:', response.data);
            return response.data;
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
        addLocalMessage(state, action: PayloadAction<Message>) {
            state.messages.push(action.payload);
        },
        updateMessageStatus(
            state,
            action: PayloadAction<{ tempId: string; newId?: string; status: 'sent' | 'failed' }>
        ) {
            const { tempId, newId, status } = action.payload;
            const index = state.messages.findIndex((msg) => msg.id === tempId);
            if (index !== -1) {
                const currentMessage = state.messages[index];
                // Replace the message with a new object
                state.messages[index] = {
                    ...currentMessage,
                    id: newId || currentMessage.id,
                    status: status,
                };
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchChats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
          .addCase(fetchChats.fulfilled, (state, action) => {
              state.loading = false;
              action.payload.forEach((chat) => {
                  const index = state.chats.findIndex(existingChat => existingChat._id === chat._id);
                  if (index === -1) {
                      // Chat is new, so add it
                      state.chats.push(chat);
                  } else if (chat.unreadCount > 0 || chat.lastMessage?._id !== state.chats[index].lastMessage?._id) {
                      // Chat exists and has an unread count greater than zero, so update it
                      state.chats[index] = chat;
                  }
              });
          })
          .addCase(fetchChats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchMessages.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.loading = false;
                // Filter out any messages that are not in the fetched data
                // Prevent duplicates based on message ID
                const fetchedMessageIds = new Set(action.payload.map((msg: Message) => msg.id));
                state.messages = [
                    ...state.messages.filter(
                        (msg) => !fetchedMessageIds.has(msg.id) && msg.status === 'sending'
                    ),
                    ...action.payload,
                ];
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Uncomment and implement the sendMessage case if needed
            // .addCase(sendMessage.pending, (state) => {
            //     state.loading = true;
            //     state.error = null;
            // })
            // .addCase(sendMessage.fulfilled, (state, action) => {
            //     state.loading = false;
            //     state.messages.push(action.payload);
            // })
            // .addCase(sendMessage.rejected, (state, action) => {
            //     state.loading = false;
            //     state.error = action.payload;
            // })
            .addCase(fetchFollowing.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchFollowing.fulfilled, (state, action) => {
                state.loading = false;
                // Handle the fetched following data here
                state.following = action.payload;
            })
            .addCase(fetchFollowing.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createConversation.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createConversation.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.existingConversation) {
                    state.newConversation = action.payload.existingConversation;
                }else {
                    state.newConversation = action.payload;
                }
            })
            .addCase(createConversation.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearMessages, addLocalMessage, updateMessageStatus } = messagesSlice.actions;
export const selectMessagesState = (state: RootState) => state.messages;
export default messagesSlice.reducer;
