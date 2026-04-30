import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from '../app/apiBaseQuery';

export const SalesAPI = createApi({
    reducerPath: 'SalesAPI',
    baseQuery,
    tagTypes: ['Clients', 'BOMs', 'Inquiries', 'Quotes', 'SalesDashboard'],
    endpoints: (builder) => ({

        // ── DASHBOARD ──────────────────────────────────────────────────────
        getSalesDashboard: builder.query({
            query: () => 'sales/getSalesDashboard',
            providesTags: ['SalesDashboard'],
        }),


        // ── CLIENTS ────────────────────────────────────────────────────────
        getAllClients: builder.query({
            query: ({ status = '', page = 1, limit = 10 } = {}) => {
                const params = new URLSearchParams();
                if (status) params.append('status', status);
                params.append('page', page);
                params.append('limit', limit);
                return `sales/getAllClients?${params.toString()}`;
            },
            providesTags: ['Clients'],
            keepUnusedDataFor: 0,
        }),
        createUpdateClient: builder.mutation({
            query: (body) => ({ url: 'sales/createUpdateClient', method: 'POST', body }),
            invalidatesTags: ['Clients'],
        }),

        // ── BOM ────────────────────────────────────────────────────────────
        getAllBOMs: builder.query({
            query: ({ inquiryId = '', page = 1, limit = 10 } = {}) => {
                const params = new URLSearchParams();
                if (inquiryId) params.append('inquiryId', inquiryId);
                params.append('page', page);
                params.append('limit', limit);
                return `sales/getAllBOMs?${params.toString()}`;
            },
            providesTags: ['BOMs'],
            keepUnusedDataFor: 0,
        }),
        getBOMById: builder.query({
            query: (id) => `sales/getBOMById/${id}`,
            providesTags: (result, error, id) => [{ type: 'BOMs', id }],
        }),
        createBOM: builder.mutation({
            query: (body) => ({ url: 'sales/createBOM', method: 'POST', body }),
            invalidatesTags: ['BOMs'],
        }),
        addBOMRevision: builder.mutation({
            query: (body) => ({ url: 'sales/addBOMRevision', method: 'POST', body }),
            invalidatesTags: ['BOMs'],
        }),
        createEstimateRequest: builder.mutation({
            query: (body) => ({ url: 'sales/createEstimateRequest', method: 'POST', body }),
            invalidatesTags: ['BOMs'],
        }),

        // ── INQUIRIES ──────────────────────────────────────────────────────
        getAllInquiries: builder.query({
            query: ({ status = '', assignedTo = '', page = 1, limit = 10 } = {}) => {
                const params = new URLSearchParams();
                if (status) params.append('status', status);
                if (assignedTo) params.append('assignedTo', assignedTo);
                params.append('page', page);
                params.append('limit', limit);
                return `sales/getAllInquiries?${params.toString()}`;
            },
            providesTags: ['Inquiries'],
            keepUnusedDataFor: 0,
        }),
        getInquiryById: builder.query({
            query: (id) => `sales/getInquiryById/${id}`,
            providesTags: (result, error, id) => [{ type: 'Inquiries', id }],
        }),
        createUpdateInquiry: builder.mutation({
            query: (body) => ({ url: 'sales/createUpdateInquiry', method: 'POST', body }),
            invalidatesTags: ['Inquiries'],
        }),

        // ── QUOTES ─────────────────────────────────────────────────────────
        getAllQuotes: builder.query({
            query: ({ status = [], clientId = '', inquiryId = '', search = '', page = 1, limit = 10 } = {}) => {
                const params = new URLSearchParams();
                if (Array.isArray(status)) {
                    status.forEach((s) => { if (s) params.append('status', s); });
                } else if (status) {
                    params.append('status', status);
                }
                if (clientId) params.append('clientId', clientId);
                if (inquiryId) params.append('inquiryId', inquiryId);
                if (search) params.append('search', search);
                params.append('page', page);
                params.append('limit', limit);
                return `sales/getAllQuotes?${params.toString()}`;
            },
            providesTags: ['Quotes'],
            keepUnusedDataFor: 0,
        }),
        getQuoteById: builder.query({
            query: (id) => `sales/getQuoteById/${id}`,
            providesTags: (result, error, id) => [{ type: 'Quotes', id }],
        }),
        createQuote: builder.mutation({
            query: (body) => ({ url: 'sales/createQuote', method: 'POST', body }),
            invalidatesTags: ['Inquiries', 'Quotes'],
        }),

    }),
});

export const {
    useGetAllClientsQuery,
    useCreateUpdateClientMutation,
    useGetAllBOMsQuery,
    useGetBOMByIdQuery,
    useCreateBOMMutation,
    useAddBOMRevisionMutation,
    useCreateEstimateRequestMutation,
    useGetAllInquiriesQuery,
    useGetInquiryByIdQuery,
    useCreateUpdateInquiryMutation,
    useGetAllQuotesQuery,
    useGetQuoteByIdQuery,
    useCreateQuoteMutation,
    useGetSalesDashboardQuery
} = SalesAPI;