import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import {
  IActionState,
  IAuthState,
  IAuthenticateRequest,
  IAuthenticateResponse,
} from "../models/Main";
import { login } from "./auth-actions";
import { apiSlice } from "../utils/api/api-slice";
import { AUTH_URL } from "../settings/constants";

const initActionState: IActionState = {
  status: "idle",
  error: null,
};

const initState: IAuthState = {
  name: null,
  email: null,
  accessToken: null,
  isLoggedIn: false,
  loginState: initActionState,
};

const auth = createSlice({
  name: "auth",
  initialState: initState,
  reducers: {
    logout: () => initState,
    clearLoginState(state) {
      state.loginState = initActionState;
    },
    updateLoginState(state, action: PayloadAction<IAuthenticateResponse>) {
      setAuthState(state, action.payload);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(
        login.fulfilled,
        (state, action: { payload: IAuthenticateResponse; type: string }) => {
          setAuthState(state, action.payload);
        }
      )
      .addCase(login.pending, (state) => {
        state.loginState.status = "pending";
      })
      .addCase(login.rejected, (state, action) => {
        state.loginState.status = "error";
        state.loginState.error = action.error.message as string;
      });
  },
});

const setAuthState = (
  state: IAuthState,
  authResponse: IAuthenticateResponse
) => {
  state.loginState.status = "success";
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
