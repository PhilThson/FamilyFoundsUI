import { createSlice } from "@reduxjs/toolkit";
import { TransactionState, Transaction } from "../models/Main";

const initState: TransactionState = {
  transactions: [],
  isVisible: false,
  totalAmount: 0.0,
};

const transactionSlice = createSlice({
  name: "transactions",
  initialState: initState,
  reducers: {
    setTransactionList(
      state,
      action: { payload: Transaction[]; type: string }
    ) {
      if (action.payload && action.payload.length > 0) {
        state.transactions = action.payload;
        state.totalAmount = getTotalAmount(state.transactions);
      }
    },
    toggle(state) {
      state.isVisible = !state.isVisible;
    },
  },
});

const getTotalAmount = (items: Transaction[]) =>
  items.reduce((acc, curr) => (acc += curr.amount), 0);

export const transactionActions = transactionSlice.actions;
export default transactionSlice.reducer;
