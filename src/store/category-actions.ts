import { createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../utils/api-client";
import { CATEGORIES_API_URL } from "../settings/constants";
import { RootState } from ".";
import { IApiError } from "../models/Main";

export const fetchAllCategories = createAsyncThunk(
  "categories/fetchAllCategories",
  async (_, { getState }) => {
    try {
      const response = await client.get(CATEGORIES_API_URL, {
        auth: (getState() as RootState).auth,
      });
      return response.data;
    } catch (err) {
      return Promise.reject(
        (err as IApiError)?.Message
          ? (err as IApiError)?.Message
          : "Wystąpił błąd podczas pobierania listy kategorii."
      );
    }
  }
);
