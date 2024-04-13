import { createSlice } from "@reduxjs/toolkit";
import {
  ITransactionState,
  ITransaction,
  IActionState,
  ISummaryData,
  ICategorySum,
  IDateRange,
} from "../models/Main";
import { apiSlice } from "../utils/api/api-slice";
import { TRANSACTIONS_URL } from "../settings/constants";
import { CreateTransactionDto } from "../models/Create";
import { UpdateTransactionDto } from "../models/Update";

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
    transactionsCount: 0,
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
  },
  extraReducers(builder) {
    builder
      .addMatcher(
        transactionsApiSlice.endpoints.getTransactions.matchFulfilled,
        (state, action) => {
          console.log("Match fullfilled fetchAll");
          state.transactions = action.payload;
          state.summaryData = computeSummary(state.transactions);
          state.fetchAllState.status = "success";
        }
      )
      .addMatcher(
        transactionsApiSlice.endpoints.getTransactions.matchPending,
        (state) => {
          console.log("Match pending fetchAll");
          state.fetchAllState.status = "pending";
        }
      )
      .addMatcher(
        transactionsApiSlice.endpoints.getTransactions.matchRejected,
        (state, { payload }) => {
          console.log("Match error fetchAll. Payload:", payload);
          state.fetchAllState.status = "error";
          state.fetchAllState.error = JSON.stringify(payload);
        }
      )
      .addMatcher(
        transactionsApiSlice.endpoints.addTransaction.matchFulfilled,
        (state, action) => {
          state.addNewState.status = "success";
          state.transactions.push(action.payload);
        }
      )
      .addMatcher(
        transactionsApiSlice.endpoints.updateTransaction.matchFulfilled,
        (state, action) => {
          state.updateState.status = "success";
          let newTransactionsList = state.transactions.filter(
            (t) => t.id !== action.payload.id
          );
          newTransactionsList.push(action.payload);
          state.transactions = newTransactionsList;
          state.summaryData = computeSummary(newTransactionsList);
        }
      )
      .addMatcher(
        transactionsApiSlice.endpoints.deleteTransaction.matchFulfilled,
        (state, action) => {
          state.deleteState.status = "success";
          state.transactions = state.transactions.filter(
            (t) => t.id !== action.payload
          );
          state.summaryData = computeSummary(state.transactions);
        }
      );
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
    transactionsCount: items.length,
  };
};

export const transactionActions = transactionSlice.actions;
export default transactionSlice.reducer;

export const transactionsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTransactions: builder.query<ITransaction[], IDateRange>({
      query: (dateRange) =>
        TRANSACTIONS_URL +
        `?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`,
    }),
    addTransaction: builder.mutation<ITransaction, CreateTransactionDto>({
      query: (transaction) => {
        const transactionToSend: CreateTransactionDto = {
          ...transaction,
          description: transaction.description || undefined,
          postingDate: transaction.postingDate || undefined,
          categoryId: transaction.categoryId || undefined,
          account: transaction.account || undefined,
          contractorAccountNumber:
            transaction.contractorAccountNumber || undefined,
          contractorBankName: transaction.contractorBankName || undefined,
        };
        return {
          url: TRANSACTIONS_URL,
          method: "POST",
          body: transactionToSend,
        };
      },
    }),
    updateTransaction: builder.mutation<ITransaction, UpdateTransactionDto>({
      query: (transaction) => ({
        url: TRANSACTIONS_URL,
        method: "PUT",
        body: transaction,
      }),
    }),
    deleteTransaction: builder.mutation<number, number>({
      query: (id) => ({
        url: `${TRANSACTIONS_URL}/${id}`,
        method: "DELETE",
      }),
      transformResponse: (result, meta, args) => args,
    }),
    importTransactionsFromCsv: builder.mutation<number, FormData>({
      query: (formData) => ({
        url: `${TRANSACTIONS_URL}/import`,
        method: "POST",
        body: formData,
        isForm: true,
      }),
    }),
  }),
});

export const {
  useLazyGetTransactionsQuery,
  useAddTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
  useImportTransactionsFromCsvMutation,
} = transactionsApiSlice;
