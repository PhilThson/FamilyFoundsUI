import { createAsyncThunk } from "@reduxjs/toolkit";
import { uiSliceActions } from "./ui-slice";
import { TRANSACTIONS_API_URL } from "../settings/constants";
//import { DateRange } from "../models/Main";
import { client } from "../utils/api-client";
import { CreateTransaction } from "../models/Create";

//dateRange: DateRange

export const fetchAllTransactions = createAsyncThunk(
  "transactions/fetchAllTransactions",
  async () => {
    const response = await client.get(TRANSACTIONS_API_URL);
    return response.data;
  }
);
//<ThunkAction<void, RootState, unknown, UnknownAction>>
export const addNewTransaction = createAsyncThunk(
  "transactions/addNewTransaction",
  async (transaction: CreateTransaction, { dispatch }) => {
    try {
      const response = await client.post(TRANSACTIONS_API_URL, transaction);
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
