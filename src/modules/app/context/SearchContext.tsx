import React, { createContext, useContext, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../modules/store.ts';

import {
    fetchSearch,
    clearSearchResults,
    clearSearchHistory,
    selectSearchState,
} from '../stores/search/searchSlice';

interface SearchContextType {
    searchResults: any[];
    searchHistory: any[];
    loading: boolean;
    error: any;
    fetchSearch: (query: string) => void;
    clearSearchResults: () => void;
    clearSearchHistory: () => void;
}

const SearchContext = createContext<SearchContextType | null>(null);

interface SearchProviderProps {
    children: ReactNode;
}

const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { searchResults, searchHistory, loading, error } = useSelector(selectSearchState);

    const handleSearch = async (query: string) => {
        try {
            await dispatch(fetchSearch(query)).unwrap();
        } catch (err: any) {
            console.error(err);
        }
    };

    return (
        <SearchContext.Provider
            value={{
                searchResults,
                searchHistory,
                loading,
                error,
                fetchSearch: handleSearch,
                clearSearchResults: () => dispatch(clearSearchResults()),
                clearSearchHistory: () => dispatch(clearSearchHistory()),
            }}
        >
            {children}
        </SearchContext.Provider>
    );
};

const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
};

export { SearchProvider, useSearch };