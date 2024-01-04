import { configureStore } from "@reduxjs/toolkit";
import transactionSliceReducer from "./transaction-slice";
import uiSliceReducer from "./ui-slice";

const store = configureStore({
  reducer: { transactions: transactionSliceReducer, ui: uiSliceReducer }
});

export default store;