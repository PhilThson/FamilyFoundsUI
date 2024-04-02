import { createAsyncThunk } from "@reduxjs/toolkit";
import { uiSliceActions } from "./ui-slice";
import { TRANSACTIONS_URL } from "../settings/constants";
import { client } from "../utils/api-client";
import { CreateTransactionDto } from "../models/Create";
import { AppDispatch } from ".";
import { UpdateTransactionDto } from "../models/Update";
import { IApiError, IDateRange, ITransaction } from "../models/Main";
import type { RootState } from ".";

export const fetchAllTransactions = createAsyncThunk(
  "transactions/fetchAllTransactions",
  async (dateRange: IDateRange, { getState }) => {
    try {
      const queryData = `?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`;
      const response = await client.get(TRANSACTIONS_URL + queryData, {
        auth: (getState() as RootState).auth,
      });
      return response.data;
    } catch (err) {
      return Promise.reject(
        (err as IApiError)?.Message
          ? (err as IApiError)?.Message
          : "Wystąpił błąd podczas pobierania listy transakcji."
      );
    }
  }
);
//<ThunkAction<void, RootState, unknown, UnknownAction>>
export const addNewTransaction = createAsyncThunk(
  "transactions/addNewTransaction",
  async (transaction: CreateTransactionDto, { dispatch, getState }) => {
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

      const response = await client.post(TRANSACTIONS_URL, {
        body: transactionToSend,
        auth: (getState() as RootState).auth,
      });
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
        (err as IApiError)?.Message
          ? (err as IApiError)?.Message
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
  async (transaction: UpdateTransactionDto, { dispatch, getState }) => {
    try {
      const response = await client.put(TRANSACTIONS_URL, {
        body: transaction,
        auth: (getState() as RootState).auth,
      });
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
        (err as IApiError)?.Message
          ? (err as IApiError)?.Message
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
    // state: RootState;
    // extra: {
    //   jwt: string
    // }
  }
>(
  "transactions/deleteTransaction",
  async (id: number, { dispatch, getState }) => {
    try {
      await client.delete(`${TRANSACTIONS_URL}/${id}`, {
        auth: (getState() as RootState).auth,
      });
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
        (err as IApiError)?.Message
          ? (err as IApiError)?.Message
          : "Wystąpił błąd podczas usuwania transakcji."
      );
    }
  }
);

export const importTransactionsFromCsv = createAsyncThunk(
  "transactions/importTransactionsFromCsv",
  async (formData: FormData, { dispatch, getState }) => {
    try {
      const response = await client.post(`${TRANSACTIONS_URL}/import`, {
        body: formData,
        isForm: true,
        auth: (getState() as RootState).auth,
      });
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
        (err as IApiError)?.Message
          ? (err as IApiError)?.Message
          : "Wystąpił błąd podczas importowania listy transakcji."
      );
    }
  }
);
