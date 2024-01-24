import { createSlice } from "@reduxjs/toolkit";
import {
  ITransactionState,
  ITransaction,
  IActionState,
  ISummaryData,
  ICategorySum,
} from "../models/Main";
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
  fetchAllState: initActionState,
  addNewState: initActionState,
  updateState: initActionState,
  deleteState: initActionState,
  importState: initActionState,
  summaryData: {
    totalDebit: 0.0,
    totalCredit: 0.0,
    balance: 0.0,
    categoriesCount: [],
  },
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
        state.summaryData = computeSummary(state.transactions);
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
          state.summaryData = computeSummary(newTransactionsList);
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
        state.summaryData = computeSummary(state.transactions);
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

const computeSummary = (items: ITransaction[]): ISummaryData => {
  let totalDebit = 0;
  let totalCredit = 0;
  const categoriesCount: { [name: string]: ICategorySum } = {};
  items.forEach((item) => {
    if (item.amount < 0) {
      totalDebit += item.amount;
      const categoryName = item.category?.name || "Brak";
      categoriesCount[categoryName]
        ? (categoriesCount[categoryName].amount += item.amount)
        : (categoriesCount[categoryName] = {
            name: categoryName,
            amount: item.amount,
          });
    } else {
      totalCredit += item.amount;
    }
  });
  const balance = totalDebit + totalCredit;
  return {
    totalDebit,
    totalCredit,
    balance,
    categoriesCount: Object.values(categoriesCount),
  };
};

export const transactionActions = transactionSlice.actions;
export default transactionSlice.reducer;
