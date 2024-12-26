import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/stores/authSlice';
import themeReducer from './app/stores/themeSlice';
import homeReducer from './app/stores/home/homeSlice';
import searchReducer from './app/stores/search/searchSlice';
import notificationsReducer from './app/stores/notifications/notificationsSlice';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage'; // AsyncStorage for React Native
import { combineReducers } from 'redux';

// Create persist configuration for auth slice
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth','theme'], // Only persist the auth slice
};

// Combine reducers if you have multiple slices
const rootReducer = combineReducers({
  // [authApi.reducerPath]: authApi.reducer,
  auth: authReducer,
  theme: themeReducer,
  home: homeReducer,
  search: searchReducer,
  notifications: notificationsReducer,
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with the persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for redux-persist
    }),
});

// Configure persistor for the store
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
