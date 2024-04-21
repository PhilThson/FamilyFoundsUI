import { createAction } from "@reduxjs/toolkit/react";
import { IAuthenticateResponse } from "../models/Main";

export const authSliceActions = {
  updateLoginState: createAction<IAuthenticateResponse>(
    "auth/updateLoginState"
  ),
  clearLoginState: createAction("auth/clearLoginState"),
};
