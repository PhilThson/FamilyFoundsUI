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
import { transactionActions } from "../../store/transaction-slice";
import { authSliceActions } from "../../store/auth-actions";
import { isErrorWithMessage, isFetchBaseQueryError } from "./error-helper";

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

const baseFetch: BaseQueryFn = async (args, api, extraOptions) => {
  const authState = (api.getState() as RootState).auth;
  const dispatch = api.dispatch;

  let result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status === 401 && authState.isLoggedIn) {
    const refreshResult = await baseQuery(
      { url: REFRESH_TOKEN_URL, method: "POST" },
      api,
      extraOptions
    );
    if (refreshResult?.error) {
      dispatch(authSliceActions.clearLoginState());
      dispatch(transactionActions.clearTransactionsState());
    } else if (refreshResult.data) {
      const authResponse = refreshResult.data as IAuthenticateResponse;
      if (authResponse) {
        dispatch(authSliceActions.updateLoginState(authResponse));
        result = await baseQuery(args, api, extraOptions);
      }
    }
  }

  if (result.error) {
    console.log("Has error:", result.error);
    //normalize error response
    const err: FetchBaseQueryError = {
      status: "CUSTOM_ERROR",
      error: "",
    };
    let errMsg;
    if (isErrorWithMessage(result.error.data)) {
      errMsg = (result.error.data as IApiError).message;
    } else if (isFetchBaseQueryError(result.error)) {
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
  // Cache reducer at `state.api`
  reducerPath: "api",
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
