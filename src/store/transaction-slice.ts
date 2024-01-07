import { createSlice } from "@reduxjs/toolkit";
import { TransactionState, Transaction } from "../models/Main";
import { fetchAllTransactions, addNewTransaction } from "./transaction-actions";

const initState: TransactionState = {
  transactions: [],
  isVisible: false,
  totalAmount: 0.0,
  status: "idle",
  error: null,
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
  extraReducers(builder) {
    builder
      .addCase(fetchAllTransactions.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(fetchAllTransactions.fulfilled, (state, action) => {
        state.status = "success";
        state.transactions = action.payload;
        state.totalAmount = getTotalAmount(state.transactions);
      })
      .addCase(fetchAllTransactions.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message as string;
      })
      .addCase(addNewTransaction.fulfilled, (state, action) => {
        state.transactions.push(action.payload);
      });
  },
});

const getTotalAmount = (items: Transaction[]) =>
  items.reduce((acc, curr) => (acc += curr.amount), 0);

export const transactionActions = transactionSlice.actions;
export default transactionSlice.reducer;
