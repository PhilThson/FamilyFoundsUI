import { configureStore } from "@reduxjs/toolkit";
import transactionSliceReducer from "./transaction-slice";
import uiSliceReducer from "./ui-slice";

const store = configureStore({
  reducer: { transactions: transactionSliceReducer, ui: uiSliceReducer },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
