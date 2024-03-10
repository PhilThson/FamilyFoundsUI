import { createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../utils/api-client";
import { uiSliceActions } from "./ui-slice";
import { IAuthenticateResponse, IAuthenticateRequest } from "../models/Main";
import { AUTH_API_URL } from "../settings/constants";

export const login = createAsyncThunk(
  "auth/login",
  async (loginData: IAuthenticateRequest, { dispatch }) => {
    try {
      const response = await client.post(AUTH_API_URL, loginData);
      dispatch(
        uiSliceActions.showNotification({
          status: "success",
          title: "Sukces",
          message: "Zalogowano!",
        })
      );
      return response.data as IAuthenticateResponse;
    } catch (err) {
      return Promise.reject(
        (err as Error)?.message
          ? (err as Error)?.message
          : "Wystąpił błąd podczas logowania."
      );
    }
  }
);
