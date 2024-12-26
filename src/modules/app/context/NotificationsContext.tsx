import React, { createContext, useContext, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../modules/store.ts';

import {
    fetchNotifications,
    markAsRead,
    clearNotifications,
    selectNotificationsState,
} from '../stores/notifications/notificationsSlice';

interface NotificationsContextType {
    notifications: any[];
    loading: boolean;
    error: any;
    fetchNotifications: () => void;
    markAsRead: (notificationId: number) => void;
    clearNotifications: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | null>(null);

interface NotificationsProviderProps {
    children: ReactNode;
}

const NotificationsProvider: React.FC<NotificationsProviderProps> = ({ children }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { notifications, loading, error } = useSelector(selectNotificationsState);

    const handleFetchNotifications = async () => {
        try {
            await dispatch(fetchNotifications()).unwrap();
        } catch (err: any) {
            console.error(err);
        }
    };

    const handleMarkAsRead = async (notificationId: number) => {
        try {
            await dispatch(markAsRead(notificationId)).unwrap();
        } catch (err: any) {
            console.error(err);
        }
    };

    return (
        <NotificationsContext.Provider
            value={{
                notifications,
                loading,
                error,
                fetchNotifications: handleFetchNotifications,
                markAsRead: handleMarkAsRead,
                clearNotifications: () => dispatch(clearNotifications()),
            }}
        >
            {children}
        </NotificationsContext.Provider>
    );
};

const useNotifications = () => {
    const context = useContext(NotificationsContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationsProvider');
    }
    return context;
};

export { NotificationsProvider, useNotifications };