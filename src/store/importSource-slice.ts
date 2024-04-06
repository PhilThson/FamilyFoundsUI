import { createSlice } from "@reduxjs/toolkit";
import { IImportSource, IImportSourceState } from "../models/Main";
import { apiSlice } from "../utils/api/api-slice";
import { IMPORT_SOURCES_URL } from "../settings/constants";

const initState: IImportSourceState = {
  importSources: [],
  fetchAllState: {
    status: "idle",
    error: null,
  },
};

const importSourceSlice = createSlice({
  name: "importSources",
  initialState: initState,
  reducers: {},
});

export default importSourceSlice.reducer;

export const importSourceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getImportSources: builder.query<IImportSource[], void>({
      query: () => IMPORT_SOURCES_URL,
      //transformResponse: (rawResult) => rawResult.data as IImportSource[]
    }),
  }),
});

export const {
  useGetImportSourcesQuery, //hook generowany automatycznie
} = importSourceApiSlice;
