import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from '../app/apiBaseQuery';

export const CostingAPI = createApi({
    reducerPath: 'CostingAPI',
    baseQuery,
    tagTypes: ['Estimates', 'CostingDashboard'],
    endpoints: (builder) => ({

        getCostingDashboard: builder.query({
            query: () => 'costing/getCostingDashboard',
            providesTags: ['CostingDashboard'],
        }),

        // Pending requests — costing team inbox
        getPendingEstimateRequests: builder.query({
            query: ({ page = 1, limit = 10 } = {}) =>
                `costing/getPendingEstimateRequests?page=${page}&limit=${limit}`,
            providesTags: ['Estimates'],
            keepUnusedDataFor: 0,
        }),

        // All estimates — filterable by requestStatus
        getAllEstimates: builder.query({
            query: ({ requestStatus = '', page = 1, limit = 10 } = {}) => {
                const params = new URLSearchParams();
                if (requestStatus) params.append('requestStatus', requestStatus);
                params.append('page', page);
                params.append('limit', limit);
                return `costing/getAllEstimates?${params.toString()}`;
            },
            providesTags: ['Estimates'],
            keepUnusedDataFor: 0,
        }),

        // Single estimate with BOM items + rates snapshot
        getEstimateById: builder.query({
            query: (id) => `costing/getEstimateById/${id}`,
            providesTags: (result, error, id) => [{ type: 'Estimates', id }],
        }),

        // Costing team fills labor / plating / overhead
        createEstimate: builder.mutation({
            query: (body) => ({
                url: 'costing/createEstimate',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Estimates'],
        }),

    }),
});

export const {
    useGetPendingEstimateRequestsQuery,
    useGetAllEstimatesQuery,
    useGetEstimateByIdQuery,
    useCreateEstimateMutation,
    useGetCostingDashboardQuery
} = CostingAPI;