import { configureStore } from "@reduxjs/toolkit";
import transactionSliceReducer from "./transaction-slice";
import uiSliceReducer from "./ui-slice";
import categorySliceReducer from "./category-slice";
import importSourceSliceReducer from "./importSource-slice";
import authSliceReducer from "./auth-slice";

const store = configureStore({
  reducer: {
    transactions: transactionSliceReducer,
    ui: uiSliceReducer,
    categories: categorySliceReducer,
    importSources: importSourceSliceReducer,
    auth: authSliceReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
