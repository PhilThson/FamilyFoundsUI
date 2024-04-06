import { createSlice } from "@reduxjs/toolkit";
import { CategoryState, ICategory } from "../models/Main";
import { apiSlice } from "../utils/api/api-slice";
import { CATEGORIES_URL } from "../settings/constants";

const initState: CategoryState = {
  categories: [],
};

const categories = createSlice({
  name: "categories",
  initialState: initState,
  reducers: {},
});

export default categories.reducer;

export const categoriesApiSlice = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getCategories: build.query<ICategory[], void>({
      query: () => CATEGORIES_URL,
    }),
  }),
});

export const { useGetCategoriesQuery } = categoriesApiSlice;
