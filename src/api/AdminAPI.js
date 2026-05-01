import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from '../app/apiBaseQuery';

export const AdminAPI = createApi({
    reducerPath: 'AdminAPI',
    baseQuery,
    tagTypes: ['Dashboard'],
    endpoints: (builder) => ({
        getAdminDashboard: builder.query({
            query: () => 'admin/getAdminDashboard',
            providesTags: ['Dashboard'],
        }),

        getTableData: builder.query({
            query: ({ table, page = 1, limit = 10 }) => ({
                url: 'admin/getTableData',
                params: { table, page, limit },
            }),
            providesTags: ['TableData'],
        }),
        
        getTableRowDetail: builder.query({
            query: ({ table, id }) => `admin/getTableRowById?table=${table}&id=${id}`,
            providesTags: ['TableData'],
        }),

    }),
});

export const {
    useGetAdminDashboardQuery,
    useGetTableDataQuery,
    useGetTableRowDetailQuery
} = AdminAPI;