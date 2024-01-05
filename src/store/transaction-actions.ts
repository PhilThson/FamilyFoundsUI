import { transactionActions } from "./transaction-slice";
import { uiSliceActions } from "./ui-slice";
import { TRANSACTIONS_API_URL } from "../settings/constants";
import { DateRange } from "../models/Main";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};
//dateRange: DateRange
export const fetchTransactions = () => {
  return async (dispatch: Function) => {
    const fetchData = async () => {
      const response = await fetch(TRANSACTIONS_API_URL, {
        method: "GET",
        headers: headers,
      });
      if (!response.ok) {
        throw new Error("Wystąpił błąd podczas pobierania transakcji.");
      }
      return await response.json();
    };

    try {
      const transactions = await fetchData();
      console.log("Fetched data:");
      console.log(transactions);
      dispatch(transactionActions.setTransactionList(transactions));
    } catch (error) {
      console.log(error);
      dispatch(
        uiSliceActions.showNotification({
          status: "error",
          title: "Error",
          message: "Błąd pobierania transakcji!",
        })
      );
    }
  };
};

// export const sendNewTransaction = (newTransaction) => {
//   return async (dispatch) => {
//     dispatch(uiSliceActions.showNotification({
//       status: "pending",
//       title: "Sending",
//       message: "Trwa wysyłanie..."
//     }));

//     const postTransaction = async () => {
//       const response = await fetch(TRANSACTION_URL, {
//         method: "PUT",
//         body: JSON.stringify(newTransaction),
//         headers: headers
//       });

//       if (!response.ok) {
//         throw new Error("Wystąpił błąd podczas wysyłania nowej transakcji.");
//       }
//     };

//     try {
//       await postTransaction();
//       dispatch(uiSliceActions.showNotification({
//         status: "success",
//         title: "Success",
//         message: "Poprawnie wysłano transakcję!"
//       }));
//     } catch (error) {
//       console.log(error);
//       dispatch(uiSliceActions.showNotification({
//         status: "error",
//         title: "Error",
//         message: "Błąd wysyłania transakcji!"
//       }));
//     }
//   };
// };
