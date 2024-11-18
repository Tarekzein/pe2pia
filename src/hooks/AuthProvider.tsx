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
  selectForgotPasswordEmail,
} from '../modules/auth/stores/authSlice';
import { AppDispatch } from '../modules/store';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => void;
  register: (email: string,name:string, password: string) => void;
  logout: () => void;
  forgotPassword: (email: string) => void;
  verifyOtp: (email: string, otp: string) => void;
  resetPassword: (email: string, password: string, password_confirmation: string) => void;
  error: string | null;
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
  const forgotPasswordEmail = useSelector(selectForgotPasswordEmail);

  const handleLogin = (email: string, password: string) => {
    dispatch(login({ email, password }));
  };

  const handleRegister = (email: string, name: string, password: string) => {
    dispatch(register({ email, name, password }));
  };

  const handleLogout = () => {
    dispatch(logout());
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
