import { createSlice } from "@reduxjs/toolkit";
import { IImportSource, IImportSourceState } from "../models/Main";
import { fetchAllImportSources } from "./importSource-actions";
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
  extraReducers: (builder) => {
    builder
      .addCase(
        fetchAllImportSources.fulfilled,
        (state, action: { payload: IImportSource[]; type: string }) => {
          state.fetchAllState.status = "success";
          state.importSources = action.payload as IImportSource[];
        }
      )
      .addCase(fetchAllImportSources.pending, (state) => {
        state.fetchAllState.status = "pending";
      })
      .addCase(fetchAllImportSources.rejected, (state, action) => {
        state.fetchAllState.status = "error";
        state.fetchAllState.error = action.error.message as string;
      });
  },
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
