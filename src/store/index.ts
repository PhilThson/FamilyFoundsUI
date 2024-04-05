import { configureStore } from "@reduxjs/toolkit";
import transactionSliceReducer from "./transaction-slice";
import uiSliceReducer from "./ui-slice";
import categorySliceReducer from "./category-slice";
import importSourceSliceReducer from "./importSource-slice";
import authSliceReducer from "./auth-slice";
import { apiSlice } from "../utils/api/api-slice";

const store = configureStore({
  reducer: {
    transactions: transactionSliceReducer,
    ui: uiSliceReducer,
    categories: categorySliceReducer,
    importSources: importSourceSliceReducer,
    auth: authSliceReducer,
    //tutaj będzie to po prostu api: apiSlice.reducer
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    // apiSlice generuje domyślny middleware ktory nalezy dodac
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
