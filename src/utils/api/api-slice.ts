import {
  BaseQueryFn,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import {
  CATEGORIES_URL,
  IMPORT_SOURCES_URL,
  REFRESH_TOKEN_URL,
} from "../../settings/constants";
import { RootState } from "../../store";
import {
  IAuthenticateResponse,
  ICategory,
  IImportSource,
} from "../../models/Main";
import { authSliceActions } from "../../store/auth-actions";

const baseQuery = fetchBaseQuery({
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
  const dispatch = api.dispatch;
  let result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status === 401) {
    const refreshResult = await baseQuery(
      { url: REFRESH_TOKEN_URL, method: "POST" },
      api,
      extraOptions
    );
    if (refreshResult?.data) {
      const authResponse = refreshResult.data as IAuthenticateResponse;
      dispatch(authSliceActions.updateLoginState(authResponse));
      result = await baseQuery(args, api, extraOptions);
    } else {
      dispatch(authSliceActions.logout());
    }
  }
  return result;
};

const baseFetchWithReauth: BaseQueryFn = async (
  args,
  api,
  extraOptions,
  isFormData: boolean = false
) => {
  if (isFormData) {
    const headers = args.headers as Headers;
    headers.set("Content-Type", "multipart/form-data");
    //args.serializeBody = (body: any) => body;
    args.isJsonContentType = () => false;
  }
  return baseQueryWithReauth(args, api, extraOptions);
};

// Define single API slice object
export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api`
  reducerPath: "api",
  // All of our requests will have URLs starting with '/api'
  // baseUrl: '/api'
  baseQuery: baseFetchWithReauth,
  endpoints: (builder) => ({
    getImportSources: builder.query<IImportSource[], void>({
      query: () => IMPORT_SOURCES_URL,
      transformResponse: (rawResult: IImportSource[], meta, arg) => rawResult,
    }),
    getCategories: builder.query<ICategory[], void>({
      query: () => CATEGORIES_URL,
    }),
  }),
});

export const {
  useGetImportSourcesQuery, //hook generowany automatycznie
  useGetCategoriesQuery,
} = apiSlice;
