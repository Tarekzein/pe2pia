import React, { createContext, useContext, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  login,
  logout,
  register,
  forgotPassword,
  verifyOtp,
  resetPassword,
  selectIsAuthenticated,
  selectAuthError,
  selectForgotPasswordEmail, selectAuthLoading,
} from '../modules/auth/stores/authSlice.ts';
import { AppDispatch } from '../modules/store.ts';
import Toast from "react-native-toast-message";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  register: (email: string, firstName: string, lastName: string, password: string) => void;
  logout: () => void;
  forgotPassword: (email: string) => void;
  verifyOtp: (email: string, otp: string) => void;
  resetPassword: (email: string, password: string, password_confirmation: string) => void;
  error: string | null;
  loading: boolean;
  forgotPasswordEmail: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const error = useSelector(selectAuthError);
  const loading = useSelector(selectAuthLoading);
  const forgotPasswordEmail = useSelector(selectForgotPasswordEmail);

  const handleLogin = async (email: string, password: string) => {
    try {

      // Await the login dispatch to ensure it's complete before proceeding
      await dispatch(login({ email, password })).unwrap();

      // Optional success toast (if needed)
      Toast.show({
        type: 'success',
        text1: 'Login Successful',
        text2: 'Welcome back!',
        visibilityTime: 4000,
        autoHide: true,
      });

    } catch (err: any) {
      // Display the error toast if login fails
      Toast.show({
        type: 'error',
        text1: 'Login Error',
        text2: err.message || 'Something went wrong. Please try again.',
        visibilityTime: 4000,
        autoHide: true,
      });
    }
  };

  const handleRegister = async (email: string, firstName: string, lastName: string, password: string) => {
    await dispatch(register({ email, firstName,lastName , password })).unwrap();
  };

  const handleLogout = async () => {
    await dispatch(logout()).unwrap();
  };

  const handleForgotPassword = (email: string) => {
    dispatch(forgotPassword({ email }));
  };

  const handleVerifyOtp = (email: string, otp: string) => {
    dispatch(verifyOtp({ email, otp }));
  }
  const handleResetPassword = (email: string, password: string, password_confirmation: string) => {
    dispatch(resetPassword({ email, password, password_confirmation }));
  }
  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      login: handleLogin,
      register:handleRegister,
      logout: handleLogout,
      forgotPassword: handleForgotPassword,
      verifyOtp: handleVerifyOtp,
      resetPassword: handleResetPassword,
      error,
      loading,
      forgotPasswordEmail,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
