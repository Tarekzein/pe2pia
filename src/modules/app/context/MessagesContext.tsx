import React, { createContext, useContext, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../modules/store.ts';

import {
    fetchChats,
    fetchMessages,
    sendMessage,
    selectMessagesState,
    fetchFollowing,
    createConversation
} from '../stores/messages/messagesSlice';

interface MessagesContextType {
  chats: any[];
  messages: any[];
  following: any[];
  newConversation: any;
  loading: boolean;
  error: any;
  fetchChats: (id: string) => void;
  fetchMessages: (id: string) => void;
  sendMessage: (message: any) => void;
  fetchFollowing: (id: string) => void;
  createConversation: (data: any) => void;
}

const MessagesContext = createContext<MessagesContextType | null>(null);

interface MessagesProviderProps {
    children: ReactNode;
}

const MessagesProvider: React.FC<MessagesProviderProps> = ({ children }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { chats, messages, loading, error,following,newConversation } = useSelector(selectMessagesState);

    const handleFetchChats = async (id:string) => {
        try {
            await dispatch(fetchChats(id)).unwrap();
        } catch (err: any) {
            console.error(err);
        }
    };

    const handleFetchMessages = async (id:string) => {
        try {
            await dispatch(fetchMessages(id)).unwrap();
        } catch (err: any) {
            console.error(err);
        }
    };


    const handleSendMessage = async (message: any) => {
        try {
            await dispatch(sendMessage(message)).unwrap();
        } catch (err: any) {
            console.error(err);
        }
    };

    const handleFetchFollowing = async (id:string) => {
        try {
            await dispatch(fetchFollowing(id)).unwrap();
        } catch (err: any) {
            console.error(err);
        }
    };

    const handleCreateConversation = async (data: any) => {
        try {
            await dispatch(createConversation(data)).unwrap();
        } catch (err: any) {
            console.error(err);
        }
    };

    return (
        <MessagesContext.Provider
            value={{
                chats,
                messages,
                following,
                newConversation,
                loading,
                error,
                fetchChats: handleFetchChats,
                fetchMessages: handleFetchMessages,
                sendMessage: handleSendMessage,
                fetchFollowing: handleFetchFollowing,
                createConversation: handleCreateConversation,
            }}
        >
            {children}
        </MessagesContext.Provider>
    );
};

const useMessages = () => {
    const context = useContext(MessagesContext);
    if (!context) {
        throw new Error('useMessages must be used within a MessagesProvider');
    }
    return context;
};

export { MessagesProvider, useMessages };
