import React, { createContext, useContext, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../modules/store.ts';
import {
    fetchPosts,
    selectHomeState,
} from '../stores/home/homeSlice';


interface HomeContextType {
    posts: any[];
    loading: boolean;
    error: any;
    fetchPosts: () => void;
}

const HomeContext = createContext<HomeContextType | null>(null);


interface HomeProviderProps {
    children: ReactNode;
}

const HomeProvider: React.FC<HomeProviderProps> = ({ children }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { posts, loading, error } = useSelector(selectHomeState);

    const handleFetchPosts = async () => {
        try {
            await dispatch(fetchPosts()).unwrap();
        } catch (err: any) {
            console.error(err);
        }
    };

    return (
        <HomeContext.Provider value={{ posts, loading, error,
            fetchPosts: handleFetchPosts }}>
            {children}
        </HomeContext.Provider>
    );
}

const useHome = () => {
    const context = useContext(HomeContext);
    if (!context) {
        throw new Error('useHome must be used within a HomeProvider');
    }
    return context;
}

export { HomeProvider, useHome };