import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from '../app/apiBaseQuery';

export const RdAPI = createApi({
    reducerPath: 'StyleAPI',
    baseQuery,
    tagTypes: ['Styles'],
    endpoints: (builder) => ({

        getAllStyles: builder.query({
            query: ({ status = '', origin = '', search = '', page = 1, limit = 10 }) =>
                `style/getAllStyles?status=${status}&origin=${origin}&search=${search}&page=${page}&limit=${limit}`,
            providesTags: ['Styles'],
            keepUnusedDataFor: 0,
        }),

        getStyleById: builder.query({
            query: (id) => `style/getStyleById/${id}`,
            providesTags: (result, error, id) => [{ type: 'Styles', id }],
        }),

        createUpdateStyle: builder.mutation({
            query: (formData) => ({
                url: 'style/createUpdateStyle',
                method: 'POST',
                body: formData,
                // Don't set Content-Type — browser sets multipart/form-data with boundary
                formData: true,
            }),
            invalidatesTags: ['Styles'],
        }),

        archiveStyle: builder.mutation({
            query: (id) => ({
                url: 'style/archiveStyle',
                method: 'POST',
                body: { id },
            }),
            invalidatesTags: ['Styles'],
        }),

    }),
});

export const {
    useGetAllStylesQuery,
    useGetStyleByIdQuery,
    useCreateUpdateStyleMutation,
    useArchiveStyleMutation,
} = RdAPI;