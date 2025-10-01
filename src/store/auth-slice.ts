import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import {
  IAuthState,
  IAuthenticateRequest,
  IAuthenticateResponse,
} from "../models/Main";
import { apiSlice } from "../utils/api/api-slice";
import { AUTH_URL, REFRESH_TOKEN_URL } from "../settings/constants";

interface JwtPayload {
  sub?: string;
  exp: number;
}

const getInitState = (): IAuthState => {
  let initState: IAuthState = {
    name: null,
    email: null,
    accessToken: "",
    isLoggedIn: false,
  };

  const accessTokenMemo = localStorage.getItem("accessToken");
  if (accessTokenMemo) {
    const { sub } = jwtDecode<JwtPayload>(accessTokenMemo);
    initState.name = sub || "";
    initState.accessToken = accessTokenMemo;
    initState.isLoggedIn = true;
  }

  return initState;
};

const setAuthState = (
  state: IAuthState,
  authResponse: IAuthenticateResponse
) => {
  state.accessToken = authResponse.jwtToken;
  state.isLoggedIn = true;
  localStorage.setItem("accessToken", authResponse.jwtToken);
  const { sub } = jwtDecode<JwtPayload>(authResponse.jwtToken);
  state.name = sub || "";
};

const auth = createSlice({
  name: "auth",
  initialState: getInitState(),
  reducers: {
    clearLoginState: () => {
      localStorage.removeItem("accessToken");
      return getInitState();
    },
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

export default auth.reducer;
export const { clearLoginState, updateLoginState } = auth.actions;

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<IAuthenticateResponse, IAuthenticateRequest>({
      query: (credentials) => ({
        url: AUTH_URL,
        method: "POST",
        body: credentials,
      }),
    }),
    refreshToken: builder.mutation<IAuthenticateResponse, void>({
      query: () => ({
        url: REFRESH_TOKEN_URL,
        method: "POST",
      }),
    }),
  }),
});

export const { useLoginMutation } = authApiSlice;
