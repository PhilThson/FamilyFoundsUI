import { PayloadAction, createSlice } from "@reduxjs/toolkit/react";
import { jwtDecode } from "jwt-decode";
import {
  IAuthState,
  IAuthenticateRequest,
  IAuthenticateResponse,
} from "../models/Main";
import { apiSlice } from "../utils/api/api-slice";
import { AUTH_URL } from "../settings/constants";

const initState: IAuthState = {
  name: null,
  email: null,
  accessToken: null,
  isLoggedIn: false,
};

const auth = createSlice({
  name: "auth",
  initialState: initState,
  reducers: {
    clearLoginState: () => initState,
    updateLoginState(state, action: PayloadAction<IAuthenticateResponse>) {
      setAuthState(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApiSlice.endpoints.login.matchFulfilled,
      (state, action) => {
        setAuthState(state, action.payload);
      }
    );
  },
});

const setAuthState = (
  state: IAuthState,
  authResponse: IAuthenticateResponse
) => {
  state.accessToken = authResponse.jwtToken;
  state.isLoggedIn = true;
  const { sub } = jwtDecode(authResponse.jwtToken);
  state.name = sub || "";
};

export default auth.reducer;

const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<IAuthenticateResponse, IAuthenticateRequest>({
      query: (credentials) => ({
        url: AUTH_URL,
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const {
  useLoginMutation, //automatycznie generowany hook
} = authApiSlice;
