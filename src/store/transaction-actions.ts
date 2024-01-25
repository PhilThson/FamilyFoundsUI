import { createAsyncThunk } from "@reduxjs/toolkit";
import { uiSliceActions } from "./ui-slice";
import { TRANSACTIONS_API_URL } from "../settings/constants";
import { client } from "../utils/api-client";
import { CreateTransactionDto } from "../models/Create";
import { AppDispatch } from ".";
import { UpdateTransactionDto } from "../models/Update";
import { IDateRange, ITransaction } from "../models/Main";

export const fetchAllTransactions = createAsyncThunk(
  "transactions/fetchAllTransactions",
  async (dateRange: IDateRange) => {
    try {
      const queryData = `?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`;
      const response = await client.get(TRANSACTIONS_API_URL + queryData);
      return response.data;
    } catch (err) {
      return Promise.reject(
        (err as Error)?.message
          ? (err as Error)?.message
          : "Wystąpił błąd podczas pobierania listy transakcji."
      );
    }
  }
);
//<ThunkAction<void, RootState, unknown, UnknownAction>>
export const addNewTransaction = createAsyncThunk(
  "transactions/addNewTransaction",
  async (transaction: CreateTransactionDto, { dispatch }) => {
    try {
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

      const response = await client.post(
        TRANSACTIONS_API_URL,
        transactionToSend
      );
      dispatch(
        uiSliceActions.showNotification({
          status: "success",
          title: "Sukces",
          message: "Poprawnie zapisano transakcję!",
        })
      );
      return response.data;
    } catch (err) {
      dispatch(
        uiSliceActions.showNotification({
          status: "error",
          title: "Błąd",
          message: "Błąd dodawania transakcji.",
        })
      );
      return Promise.reject(
        (err as Error)?.message
          ? (err as Error)?.message
          : "Wystąpił błąd podczas dodawania transakcji."
      );
    }
  }
);

export const updateTransaction = createAsyncThunk(
  // <
  //   UpdateTransactionDto,
  //   ITransaction,
  //   { dispatch: AppDispatch }
  // >
  "transactions/updateTransaction",
  async (transaction: UpdateTransactionDto, { dispatch }) => {
    try {
      const response = await client.put(TRANSACTIONS_API_URL, transaction);
      dispatch(
        uiSliceActions.showNotification({
          status: "success",
          title: "Sukces",
          message: "Poprawnie zapisano transakcję!",
        })
      );
      return response.data as ITransaction;
    } catch (err) {
      dispatch(
        uiSliceActions.showNotification({
          status: "error",
          title: "Błąd",
          message: "Błąd aktualizowania transakcji.",
        })
      );
      return Promise.reject(
        (err as Error)?.message
          ? (err as Error)?.message
          : "Wystąpił błąd podczas dodawania transakcji."
      );
    }
  }
);

export const deleteTransaction = createAsyncThunk<
  number,
  number,
  {
    dispatch: AppDispatch;
    // state: State
    // extra: {
    //   jwt: string
    // }
  }
>("transactions/deleteTransaction", async (id: number, { dispatch }) => {
  try {
    await client.delete(`${TRANSACTIONS_API_URL}/${id}`);
    return id;
  } catch (err) {
    dispatch(
      uiSliceActions.showNotification({
        status: "error",
        title: "Błąd",
        message: "Błąd usuwania transakcji.",
      })
    );
    return Promise.reject(
      (err as Error)?.message
        ? (err as Error)?.message
        : "Wystąpił błąd podczas usuwania transakcji."
    );
  }
});

export const importTransactionsFromCsv = createAsyncThunk(
  "transactions/importTransactionsFromCsv",
  async (formData: FormData, { dispatch }) => {
    try {
      const response = await client.post(
        `${TRANSACTIONS_API_URL}/import`,
        formData,
        true //isForm
      );
      dispatch(
        uiSliceActions.showNotification({
          status: "success",
          title: "Sukces",
          message: `Poprawnie dodano ${response.data} transakcji`,
        })
      );
      return response.data;
    } catch (err) {
      dispatch(
        uiSliceActions.showNotification({
          status: "error",
          title: "Błąd",
          message: "Błąd importowania listy transakcji.",
        })
      );
      return Promise.reject(
        (err as Error)?.message
          ? (err as Error)?.message
          : "Wystąpił błąd podczas importowania listy transakcji."
      );
    }
  }
);
