import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import {
  IActionState,
  IAuthState,
  IAuthenticateResponse,
} from "../models/Main";
import { login } from "./auth-actions";

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
  },
  extraReducers(builder) {
    builder
      .addCase(
        login.fulfilled,
        (state, action: { payload: IAuthenticateResponse; type: string }) => {
          state.loginState.status = "success";
          state.accessToken = action.payload.jwtToken;
          state.isLoggedIn = true;
          const { sub } = jwtDecode(state.accessToken);
          state.name = sub || "";
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

export const authSliceActions = auth.actions;
export default auth.reducer;
