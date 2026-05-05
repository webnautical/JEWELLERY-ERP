import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from '../app/apiBaseQuery';

export const CommonAPI = createApi({
    reducerPath: 'CommonAPI',
    baseQuery,
    tagTypes: ['Notifications'],
    endpoints: (builder) => ({
        getNotifications: builder.query({
            query: () => 'common/getNotifications',
            providesTags: ['Notifications'],
        }),
        markNotificationRead: builder.query({
            query: (id) => `common/markNotificationRead/${id}`,
            invalidatesTags: ['Notifications'],
        }),
        markAllNotificationsRead: builder.query({
            query: () => 'common/markAllNotificationsRead',
            invalidatesTags: ['Notifications'],
        }),
    }),
});

export const {
    useGetNotificationsQuery,
    useLazyMarkNotificationReadQuery,
    useLazyMarkAllNotificationsReadQuery,
} = CommonAPI;