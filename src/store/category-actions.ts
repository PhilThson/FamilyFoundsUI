import { createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../utils/api-client";
import { CATEGORIES_API_URL } from "../settings/constants";

export const fetchAllCategories = createAsyncThunk(
  "categories/fetchAllCategories",
  async () => {
    try {
      const response = await client.get(CATEGORIES_API_URL);
      return response.data;
    } catch (err) {
      console.error("Catch err:", err);
      return Promise.reject(
        "Wystąpił błąd podczas pobierania listy kategorii."
      );
    }
  }
);
