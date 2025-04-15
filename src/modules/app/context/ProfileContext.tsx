import React, { createContext, useContext, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../modules/store.ts';

import {
    fetchProfile,
    updateProfile,
    updateProfileImage,
    selectProfileState,
    fetchUserPosts,
} from '../stores/profile/profileSlice';


interface ProfileContextType {
    profile: any;
    userPosts: any;
    loading: boolean;
    error: any;
    fetchProfile: () => void;
    updateProfile: (data: any) => void;
    updateProfileImage: (data: any) => void;
    fetchUserPosts: (userId: string) => void;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

interface ProfileProviderProps {
    children: ReactNode;
}

const ProfileProvider: React.FC<ProfileProviderProps> = ({ children }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { profile,userPosts, loading, error } = useSelector(selectProfileState);

    const handleFetchProfile = async () => {
        try {
            await dispatch(fetchProfile()).unwrap();
        } catch (err: any) {
            console.error(err);
        }
    };

    const handleUpdateProfile = async (data: any) => {
        try {
            await dispatch(updateProfile(data)).unwrap();
        } catch (err: any) {
            console.error(err);
        }
    };

    const handleUpdateProfileImage = async (data: any) => {
        try {
            await dispatch(updateProfileImage(data)).unwrap();
        } catch (err: any) {
            console.error(err);
        }
    };

    const handleFetchUserPosts = async (userId: string) => {
        try {
            await dispatch(fetchUserPosts(userId)).unwrap();
        } catch (err: any) {
            console.error(err);
        }
    };
    return (
        <ProfileContext.Provider
            value={{
                profile,
                userPosts,
                loading,
                error,
                fetchProfile: handleFetchProfile,
                updateProfile: handleUpdateProfile,
                updateProfileImage: handleUpdateProfileImage,
                fetchUserPosts: handleFetchUserPosts,
            }}
        >
            {children}
        </ProfileContext.Provider>
    );
};

const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
};

export { ProfileProvider, useProfile };
