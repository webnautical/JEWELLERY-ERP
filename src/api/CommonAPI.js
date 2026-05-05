import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from '../app/apiBaseQuery';

export const CommonAPI = createApi({
    reducerPath: 'CommonAPI',
    baseQuery,
    endpoints: (builder) => ({
        getNotifications: builder.query({
            query: () => 'common/getNotifications',
        }),
    }),
});

export const {
    useGetNotificationsQuery,
} = CommonAPI;