import { createSlice } from "@reduxjs/toolkit";
import { CategoryState } from "../models/Main";
import { fetchAllCategories } from "./category-actions";

const initState: CategoryState = {
  categories: [],
  status: "idle",
  error: null,
};

const categories = createSlice({
  name: "categories",
  initialState: initState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.status = "success";
        state.categories = action.payload;
      })
      .addCase(fetchAllCategories.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message as string;
      });
  },
});

export default categories.reducer;
