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
    logout(state) {
      state = initState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(
        login.fulfilled,
        (state, action: { payload: IAuthenticateResponse; type: string }) => {
          state.loginState.status = "success";
          state.accessToken = action.payload.jwtToken;
          console.log(state.accessToken);
          console.log(jwtDecode(state.accessToken));
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

export default auth.reducer;
