import { createSlice } from "@reduxjs/toolkit";
import { TransactionState, Transaction } from "../models/Main";
import {
  fetchAllTransactions,
  addNewTransaction,
  deleteTransaction,
} from "./transaction-actions";

const initState: TransactionState = {
  transactions: [],
  isVisible: false,
  totalAmount: 0.0,
  fetchAllStatus: "idle",
  fetchAllError: null,
  addNewStatus: "idle",
  addNewError: null,
  deleteStatus: "idle",
  deleteError: null,
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
      .addCase(fetchAllTransactions.fulfilled, (state, action) => {
        state.fetchAllStatus = "success";
        state.transactions = action.payload;
        state.totalAmount = getTotalAmount(state.transactions);
      })
      .addCase(fetchAllTransactions.pending, (state, action) => {
        state.fetchAllStatus = "pending";
      })
      .addCase(fetchAllTransactions.rejected, (state, action) => {
        state.fetchAllStatus = "error";
        state.fetchAllError = action.error.message as string;
      })
      .addCase(addNewTransaction.fulfilled, (state, action) => {
        state.addNewStatus = "success";
        state.transactions.push(action.payload);
      })
      .addCase(addNewTransaction.pending, (state, action) => {
        state.addNewStatus = "pending";
      })
      .addCase(addNewTransaction.rejected, (state, action) => {
        state.addNewStatus = "error";
        state.addNewError = action.error.message as string;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.deleteStatus = "success";
        state.transactions = state.transactions.filter(
          (t) => t.id !== action.payload
        );
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.deleteStatus = "error";
      });
  },
});

const getTotalAmount = (items: Transaction[]) =>
  items.reduce((acc, curr) => (acc += curr.amount), 0);

export const transactionActions = transactionSlice.actions;
export default transactionSlice.reducer;
