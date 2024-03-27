import { createSlice } from "@reduxjs/toolkit";
import { IImportSource, IImportSourceState } from "../models/Main";
import { fetchAllImportSources } from "./importSource-actions";

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
