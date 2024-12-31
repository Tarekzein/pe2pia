import React, { createContext, useContext, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../modules/store.ts';

import {
    fetchChats,
    fetchMessages,
    sendMessage,
    selectMessagesState,
} from '../stores/messages/messagesSlice';

interface MessagesContextType {
    chats: any[];
    messages: any[];
    loading: boolean;
    error: any;
    fetchChats: (id:string) => void;
    fetchMessages: () => void;
    sendMessage: (message: string) => void;
}

const MessagesContext = createContext<MessagesContextType | null>(null);

interface MessagesProviderProps {
    children: ReactNode;
}

const MessagesProvider: React.FC<MessagesProviderProps> = ({ children }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { chats, messages, loading, error } = useSelector(selectMessagesState);

    const handleFetchChats = async (id:string) => {
        try {
            await dispatch(fetchChats(id)).unwrap();
        } catch (err: any) {
            console.error(err);
        }
    };

    const handleFetchMessages = async () => {
        try {
            await dispatch(fetchMessages()).unwrap();
        } catch (err: any) {
            console.error(err);
        }
    };

    const handleSendMessage = async (message: string) => {
        try {
            await dispatch(sendMessage(message)).unwrap();
        } catch (err: any) {
            console.error(err);
        }
    };

    return (
        <MessagesContext.Provider
            value={{
                chats,
                messages,
                loading,
                error,
                fetchChats: handleFetchChats,
                fetchMessages: handleFetchMessages,
                sendMessage: handleSendMessage,
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
