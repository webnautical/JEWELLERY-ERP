import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from '../app/apiBaseQuery';

export const RatesAPI = createApi({
    reducerPath: 'RatesAPI',
    baseQuery,
    tagTypes: ['Assets', 'Rates'],
    endpoints: (builder) => ({

        getRateDashboard: builder.query({
            query: () => 'sourcing/getRateDashboard',
            providesTags: ['Rates'],
        }),

        getAllAssets: builder.query({
            query: ({ status = '' } = {}) => {
                const qs = status ? `?status=${status}` : '';
                return `sourcing/getAllAssets${qs}`;
            },
            providesTags: ['Assets'],
            keepUnusedDataFor: 0,
        }),

        createUpdateAsset: builder.mutation({
            query: (body) => ({
                url: 'sourcing/createUpdateAsset',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Assets', 'Rates'],
        }),

        createRate: builder.mutation({
            query: (body) => ({
                url: 'sourcing/createRate',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Rates'],
        }),

    }),
});

export const {
    useGetRateDashboardQuery,
    useGetAllAssetsQuery,
    useCreateUpdateAssetMutation,
    useCreateRateMutation,
} = RatesAPI;