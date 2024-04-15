import {
  BaseQueryFn,
  FetchBaseQueryError,
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
  IApiError,
  IAuthenticateResponse,
  ICategory,
  IImportSource,
} from "../../models/Main";
import { authSliceActions } from "../../store/auth-actions";
import { isErrorWithMessage, isFetchBaseQueryError } from "./error-helper";

const baseQuery = fetchBaseQuery({
  credentials: "include",
  // prepareHeaders: (headers, { getState }) => {
  //   const token = (getState() as RootState).auth.accessToken;
  //   if (token) {
  //     headers.set("Authorization", `Bearer ${token}`);
  //   }
  //   return headers;
  // },
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
      dispatch(authSliceActions.clearLoginState());
    }
  }
  return result;
};

const baseFetch: BaseQueryFn = async (
  args,
  api,
  extraOptions,
  isFormData: boolean = false
) => {
  console.log("baseFetchWithReauth, isFormData:", isFormData);
  if (isFormData) {
    console.log("IsFormData = true");
    (args.headers as Headers).set("Content-Type", "multipart/form-data");
    args.isJsonContentType = () => false;
  }
  const authState = (api.getState() as RootState).auth;
  if (authState.isLoggedIn) {
    (args.headers as Headers).set(
      "Authorization",
      `Bearer ${authState.accessToken}`
    );
  }

  const dispatch = api.dispatch;
  let result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status === 401 && authState.isLoggedIn) {
    console.log("Reauthing...");
    const refreshResult = await baseQuery(
      { url: REFRESH_TOKEN_URL, method: "POST" },
      api,
      extraOptions
    );
    if (refreshResult?.error) {
      console.log("Error during reauth");
      dispatch(authSliceActions.clearLoginState());
    } else if (refreshResult.data) {
      console.log("Proper reauth response");
      const authResponse = refreshResult.data as IAuthenticateResponse;
      if (authResponse) {
        dispatch(authSliceActions.updateLoginState(authResponse));
        result = await baseQuery(args, api, extraOptions);
      }
    }
  }
  console.log("Request result:", result);
  if (result.error) {
    console.log("Has error:", result.error);
    //normalize error response
    const err: FetchBaseQueryError = {
      status: "CUSTOM_ERROR",
      error: "",
    };
    let errMsg;
    if (isErrorWithMessage(result.error.data)) {
      console.log("IsErrorWithMessage");
      errMsg = (result.error.data as IApiError).message;
    } else if (isFetchBaseQueryError(result.error)) {
      console.log("IsFetchBaseQueryError");
      errMsg =
        "error" in result.error
          ? result.error.error
          : JSON.stringify(result.error.data);
    }
    err.error = errMsg ?? "Wystąpił błąd komunikacji z API";
    result.error = err;
  }
  return result;
};

export const apiSlice = createApi({
  // The cache reducer expects to be added at `state.api`
  reducerPath: "api",
  // All of our requests will have URLs starting with '/api'
  // baseUrl: '/api'
  baseQuery: baseFetch,
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
