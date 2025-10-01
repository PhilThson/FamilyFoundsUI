import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ITransactionState,
  ITransaction,
  IActionState,
  IDateRange,
  IFetchError,
} from "../models/Main";
import { apiSlice } from "../utils/api/api-slice";
import { TRANSACTIONS_URL } from "../settings/constants";
import { CreateTransactionDto } from "../models/Create";
import { UpdateTransactionDto } from "../models/Update";
import { ICategorySum, ISummaryData } from "../models/Summary";

const initActionState: IActionState = {
  status: "idle",
  error: null,
};

const currentDate = new Date();
const oneMonthAgo = new Date();
oneMonthAgo.setMonth(currentDate.getMonth() - 1);

const initState: ITransactionState = {
  transactions: [],
  isVisible: false,
  fetchAllState: initActionState,
  summaryData: {
    totalDebit: 0.0,
    totalCredit: 0.0,
    balance: 0.0,
    categoriesCount: [],
    transactionsCount: 0,
    averagePerMonth: {
      totalDebit: 0,
      totalCredit: 0,
      balance: 0,
      categoriesCount: [],
    },
  },
  dateRange: {
    startDate: oneMonthAgo.toISOString().slice(0, 10),
    endDate: currentDate.toISOString().slice(0, 10),
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
      state.transactions = action.payload;
      state.summaryData = computeSummary(state.transactions, state.dateRange);
    },
    setDateRange(state, action: PayloadAction<IDateRange>) {
      state.dateRange = action.payload;
      state.summaryData = computeSummary(state.transactions, state.dateRange);
    },
    toggle(state) {
      state.isVisible = !state.isVisible;
    },
    clearTransactionsState: () => initState,
  },
  extraReducers(builder) {
    builder
      .addMatcher(
        transactionsApiSlice.endpoints.getTransactions.matchFulfilled,
        (state, action) => {
          state.transactions = action.payload;
          state.summaryData = computeSummary(
            state.transactions,
            state.dateRange
          );
          state.fetchAllState.status = "success";
        }
      )
      .addMatcher(
        transactionsApiSlice.endpoints.getTransactions.matchPending,
        (state) => {
          state.fetchAllState.status = "pending";
        }
      )
      .addMatcher(
        transactionsApiSlice.endpoints.getTransactions.matchRejected,
        (state, { payload }) => {
          state.fetchAllState.status = "error";
          state.fetchAllState.error = (payload as IFetchError).error;
        }
      )
      .addMatcher(
        transactionsApiSlice.endpoints.addTransaction.matchFulfilled,
        (state, action) => {
          state.transactions.push(action.payload);
        }
      )
      .addMatcher(
        transactionsApiSlice.endpoints.updateTransaction.matchFulfilled,
        (state, action) => {
          let newTransactionsList = state.transactions.filter(
            (t) => t.id !== action.payload.id
          );
          newTransactionsList.push(action.payload);
          state.transactions = newTransactionsList;
          state.summaryData = computeSummary(
            newTransactionsList,
            state.dateRange
          );
        }
      )
      .addMatcher(
        transactionsApiSlice.endpoints.deleteTransaction.matchFulfilled,
        (state, action) => {
          state.transactions = state.transactions.filter(
            (t) => t.id !== action.payload
          );
          state.summaryData = computeSummary(
            state.transactions,
            state.dateRange
          );
        }
      );
  },
});

const computeSummary = (
  items: ITransaction[],
  dateRange: IDateRange
): ISummaryData => {
  let totalDebit = 0;
  let totalCredit = 0;
  const categoriesCount: { [name: string]: ICategorySum } = {};

  if (items.length === 0) {
    return {
      totalDebit: 0,
      totalCredit: 0,
      balance: 0,
      categoriesCount: [],
      transactionsCount: 0,
      averagePerMonth: {
        totalDebit: 0,
        totalCredit: 0,
        balance: 0,
        categoriesCount: [],
      },
    };
  }

  const startDate = new Date(dateRange.startDate);
  const endDate = new Date(dateRange.endDate);
  const months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth()) +
    1;

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

  const avgCategories = Object.values(categoriesCount).map((c) => ({
    ...c,
    amount: c.amount / months,
  }));

  return {
    totalDebit,
    totalCredit,
    balance,
    categoriesCount: Object.values(categoriesCount),
    transactionsCount: items.length,
    averagePerMonth: {
      totalDebit: totalDebit / months,
      totalCredit: totalCredit / months,
      balance: balance / months,
      categoriesCount: avgCategories,
    },
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
