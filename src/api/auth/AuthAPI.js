import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from '../../app/apiBaseQuery';
export const AuthAPI = createApi({
    reducerPath: 'AuthAPI',
    baseQuery,
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (params) => ({
                url: 'admin/adminLogin',
                method: 'POST',
                body: params,
            }),
        }),

        changePassword: builder.mutation({
            query: (params) => ({
                url: 'auth/resetPassword',  // update if currently different
                method: 'POST',
                body: params,
            }),
        }),
    }),
});
export const {
    useLoginMutation,
    useChangePasswordMutation
} = AuthAPI;
