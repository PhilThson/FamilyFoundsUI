import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { authSliceActions } from "../../store/auth-slice";
import {
  BASE_HTTPS_API_URL,
  REFRESH_TOKEN_URL,
} from "../../settings/constants";

const baseQuery = fetchBaseQuery({
  //baseUrl: BASE_HTTPS_API_URL,
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
    const refreshResult = await baseQuery(REFRESH_TOKEN_URL, api, extraOptions);
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

// Define our single API slice object
export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api` (already default - this is optional)
  // Tutaj chciałbym dodawać do poszczególnych slice'ow stora np.:
  // state.auth, state.categories, ...
  // a nie ogólnie do state.api
  reducerPath: 'api',
  // All of our requests will have URLs starting with '/fakeApi'
  // baseUrl: ...
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
});
