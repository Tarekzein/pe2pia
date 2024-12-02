import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import AsyncStorage from "@react-native-async-storage/async-storage";

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://api.pe2pia.com:5000/api',
        prepareHeaders: async (headers) => {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: ({ email, password }: { email: string; password: string }) => ({
                url: '/users/login',
                method: 'POST',
                body: { email, password },
            }),
        }),
        register: builder.mutation({
            query: ({ email, firstName, lastName, password }: { email: string; firstName: string; lastName: string; password: string }) => ({
                url: '/users/register',
                method: 'POST',
                body: { email, FirstName: firstName, LastName: lastName, password },
            }),
        }),
        forgotPassword: builder.mutation({
            query: ({ email }: { email: string }) => ({
                url: '/auth/forgot-password',
                method: 'POST',
                body: { email },
            }),
        }),
        verifyOtp: builder.mutation({
            query: ({ email, otp }: { email: string; otp: string }) => ({
                url: '/auth/verify-otp',
                method: 'POST',
                body: { email, otp },
            }),
        }),
        resetPassword: builder.mutation({
            query: ({ email, password, password_confirmation }: { email: string; password: string; password_confirmation: string }) => ({
                url: '/auth/reset-password',
                method: 'POST',
                body: { email, password, password_confirmation },
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            async onQueryStarted(_, { queryFulfilled }) {
                try {
                    await queryFulfilled;
                    await AsyncStorage.removeItem('token'); // Clear token on successful logout
                } catch (error) {
                    console.error('Logout failed:', error);
                }
            },
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useForgotPasswordMutation,
    useVerifyOtpMutation,
    useResetPasswordMutation,
    useLogoutMutation,
} = authApi;
