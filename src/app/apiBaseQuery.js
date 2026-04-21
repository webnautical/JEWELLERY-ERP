import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { apiBaseURL, authUser } from '../helper/Utility';

const baseQuery = fetchBaseQuery({
  baseUrl: apiBaseURL(),
  prepareHeaders: (headers) => {
    const token = authUser()?.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// ── Wrapper — token invalid ho to logout + redirect ────────────────────────
const baseQueryWithReauth = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    // Token invalid / expired
    localStorage.removeItem('web-secret');
    window.location.href = '/login';
  }

  return result;
};

export default baseQueryWithReauth;