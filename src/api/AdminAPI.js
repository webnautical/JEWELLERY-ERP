import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from '../app/apiBaseQuery';

export const AdminAPI = createApi({
    reducerPath: 'AdminAPI',
    baseQuery,
    tagTypes: ['Dashboard'],
    endpoints: (builder) => ({
        // ── ADMIN DASHBOARD ────────────────────────────────────────────────
        getAdminDashboard: builder.query({
            query: () => 'admin/getAdminDashboard',
            providesTags: ['Dashboard'],
        }),

    }),
});

export const {
    useGetAdminDashboardQuery,
} = AdminAPI;