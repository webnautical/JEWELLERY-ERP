import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from '../app/apiBaseQuery';

export const UserAPI = createApi({
    reducerPath: 'UserAPI',
    baseQuery,
    tagTypes: ['Profile', 'UnreadCount', 'Notifications', 'Users'],
    endpoints: (builder) => ({
        // ── ADMIN USER MANAGEMENT ──────────────────────────────────────────
        getAllUsers: builder.query({
            query: ({ search = '', role = '', page = 1, limit = 10 }) =>
                `admin/getAllUsers?search=${search}&role=${role}&page=${page}&limit=${limit}`,
            providesTags: ['Users'],
            keepUnusedDataFor: 0,
        }),
        getUserById: builder.query({
            query: (id) => `admin/getUserById/${id}`,
            providesTags: (result, error, id) => [{ type: 'Users', id }],
        }),
        createUser: builder.mutation({
            query: (body) => ({ url: 'admin/createUser', method: 'POST', body }),
            invalidatesTags: ['Users'],
        }),
        updateUser: builder.mutation({
            query: (body) => ({ url: `admin/updateUser`, method: 'POST', body }),
            invalidatesTags: ['Users'],
        }),
        toggleUserStatus: builder.mutation({
            query: (id) => ({
                url: 'admin/toggleUserStatus',
                method: 'POST',
                body: { id },
            }),
            invalidatesTags: ['Users'],
        }),
    }),
});

export const {
    useGetAllUsersQuery,
    useGetUserByIdQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useToggleUserStatusMutation,
} = UserAPI;