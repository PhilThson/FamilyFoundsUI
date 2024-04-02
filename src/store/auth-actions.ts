import { createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../utils/api-client";
import { uiSliceActions } from "./ui-slice";
import {
  IAuthenticateResponse,
  IAuthenticateRequest,
  IApiError,
} from "../models/Main";
import { AUTH_URL, REFRESH_TOKEN_URL } from "../settings/constants";

export const login = createAsyncThunk(
  "auth/login",
  async (loginData: IAuthenticateRequest, { dispatch }) => {
    try {
      const response = await client.post(AUTH_URL, {
        body: loginData,
        customConfig: {
          credentials: "include",
        },
      });
      dispatch(
        uiSliceActions.showNotification({
          status: "success",
          title: "Sukces",
          message: "Zalogowano!",
        })
      );
      return response.data as IAuthenticateResponse;
    } catch (err) {
      console.error("auth/login error:", err);
      return Promise.reject(
        (err as IApiError)?.Message
          ? (err as IApiError)?.Message
          : "Wystąpił błąd podczas logowania."
      );
    }
  }
);

export const refresh = createAsyncThunk("auth/refresh", async () => {
  try {
    const response = await client.post(REFRESH_TOKEN_URL, {});
    return response.data as IAuthenticateResponse;
  } catch (err) {
    console.error("auth/login error:", err);
    return Promise.reject(
      (err as IApiError)?.Message
        ? (err as IApiError)?.Message
        : "Wystąpił błąd podczas logowania."
    );
  }
});
