import {
  createApi,
  fetchBaseQuery
} from "@reduxjs/toolkit/query/react";
import { authSliceActions } from "../../store/auth-slice";
import {
  REFRESH_TOKEN_URL,
} from "../../settings/constants";

const baseQuery = fetchBaseQuery({
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const dispatch = api.dispatch;
  let result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status === 401) {
    const refreshResult = await baseQuery({ url: REFRESH_TOKEN_URL, method: "POST" }, api, extraOptions);
    if (refreshResult?.data) {
      const authResponse = refreshResult.data;
      dispatch(authSliceActions.updateLoginState(authResponse));
      result = await baseQuery(args, api, extraOptions);
    } else {
      dispatch(authSliceActions.logout());
    }
  }
  return result;
};

// Define single API slice object
export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api`
  reducerPath: 'api',
  // All of our requests will have URLs starting with '/api'
  // baseUrl: '/api'
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
});
