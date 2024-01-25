import { createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "../utils/api-client";
import { IMPORT_SOURCES_API_URL } from "../settings/constants";

export const fetchAllImportSources = createAsyncThunk(
  "importSources/fetchAllImportSources",
  async () => {
    try {
      const response = await client.get(IMPORT_SOURCES_API_URL);
      return response.data;
    } catch (err) {
      console.error("Catch err:", err);
      return Promise.reject(
        "Wystąpił błąd podczas pobierania listy źródeł importu."
      );
    }
  }
);
