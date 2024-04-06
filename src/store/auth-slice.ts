import { PayloadAction, createSlice } from "@reduxjs/toolkit";
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
    logout: () => initState,
    clearLoginState(state) {
      state = initState;
    },
    updateLoginState(state, action: PayloadAction<IAuthenticateResponse>) {
      setAuthState(state, action.payload);
    },
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

export const authSliceActions = auth.actions;
export default auth.reducer;

export const authApiSlice = apiSlice.injectEndpoints({
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
