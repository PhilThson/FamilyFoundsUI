import { createSlice } from "@reduxjs/toolkit";
import { ITransactionState, ITransaction, IActionState } from "../models/Main";
import {
  fetchAllTransactions,
  addNewTransaction,
  updateTransaction,
  deleteTransaction,
  importTransactionsFromCsv,
} from "./transaction-actions";

const initActionState: IActionState = {
  status: "idle",
  error: null,
};

const initState: ITransactionState = {
  transactions: [],
  isVisible: false,
  totalAmount: 0.0,
  fetchAllState: initActionState,
  addNewState: initActionState,
  updateState: initActionState,
  deleteState: initActionState,
  importState: initActionState,
};

const transactionSlice = createSlice({
  name: "transactions",
  initialState: initState,
  reducers: {
    setTransactionList(
      state,
      action: { payload: ITransaction[]; type: string }
    ) {
      if (action.payload && action.payload.length > 0) {
        state.transactions = action.payload;
        state.totalAmount = getTotalAmount(state.transactions);
      }
    },
    toggle(state) {
      state.isVisible = !state.isVisible;
    },
    resetNewTransactionStatus(state) {
      state.addNewState = initActionState;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchAllTransactions.fulfilled, (state, action) => {
        state.fetchAllState.status = "success";
        state.transactions = action.payload;
        state.totalAmount = getTotalAmount(state.transactions);
      })
      .addCase(fetchAllTransactions.pending, (state) => {
        state.fetchAllState.status = "pending";
      })
      .addCase(fetchAllTransactions.rejected, (state, action) => {
        state.fetchAllState.status = "error";
        state.fetchAllState.error = action.error.message as string;
      })
      .addCase(addNewTransaction.fulfilled, (state, action) => {
        state.addNewState.status = "success";
        state.transactions.push(action.payload);
      })
      .addCase(addNewTransaction.pending, (state) => {
        state.addNewState.status = "pending";
      })
      .addCase(addNewTransaction.rejected, (state, action) => {
        state.addNewState.status = "error";
        state.addNewState.error = action.error.message as string;
      })
      .addCase(
        updateTransaction.fulfilled,
        (state, action: { payload: ITransaction; type: string }) => {
          state.updateState.status = "success";
          let newTransactionsList = state.transactions.filter(
            (t) => t.id !== action.payload.id
          );
          newTransactionsList.push(action.payload);
          state.transactions = newTransactionsList;
        }
      )
      .addCase(updateTransaction.pending, (state) => {
        state.updateState.status = "pending";
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.updateState.status = "error";
        state.updateState.error = action.error.message as string;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.deleteState.status = "success";
        state.transactions = state.transactions.filter(
          (t) => t.id !== action.payload
        );
      })
      .addCase(deleteTransaction.rejected, (state) => {
        state.deleteState.status = "error";
      })
      .addCase(importTransactionsFromCsv.fulfilled, (state) => {
        state.importState.status = "success";
      })
      .addCase(importTransactionsFromCsv.pending, (state) => {
        state.importState.status = "pending";
      })
      .addCase(importTransactionsFromCsv.rejected, (state, action) => {
        state.importState.status = "error";
        state.importState.error = action.error.message as string;
      });
  },
});

const getTotalAmount = (items: ITransaction[]) =>
  items.reduce((acc, curr) => (acc += curr.amount), 0);

export const transactionActions = transactionSlice.actions;
export default transactionSlice.reducer;
