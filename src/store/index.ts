import { configureStore } from "@reduxjs/toolkit/react";
import { apiSlice } from "../utils/api/api-slice";
import transactionSliceReducer from "./transaction-slice";
import uiSliceReducer from "./ui-slice";
import authSliceReducer from "./auth-slice";

const store = configureStore({
  reducer: {
    //tutaj będzie to po prostu api: apiSlice.reducer
    [apiSlice.reducerPath]: apiSlice.reducer,
    transactions: transactionSliceReducer,
    ui: uiSliceReducer,
    auth: authSliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    // apiSlice generuje domyślny middleware ktory nalezy dodac
    getDefaultMiddleware().prepend(apiSlice.middleware),
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
