import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../../hooks/hooks";
import { uiSliceActions } from "../../../store/ui-slice";
import Transactions from "./Transactions";
import TransactionDetails from "../TransactionDetails/TransactionDetails";
import Spinner from "../../UI/Spinner";
import { ITransaction, Notification } from "../../../models/Main";
import { useDeleteTransactionMutation } from "../../../store/transaction-slice";
import AlertDialog from "../../UI/AlertDialog";
import styles from "./TransactionsArea.module.css";

const TransactionsArea: React.FC = () => {
  const { status: transactionsStatus, error: transactionsError } =
    useAppSelector((state) => state.transactions.fetchAllState);
  const transactionsCount = useAppSelector(
    (state) => state.transactions.summaryData.transactionsCount
  );
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<ITransaction | null>(null);

  const [deleteTransaction, { error }] = useDeleteTransactionMutation();

  const handleEditTransaction = (transaction: ITransaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDeleteTransaction = (transaction: ITransaction) => {
    setSelectedTransaction(transaction);
    setIsAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedTransaction) {
      try {
        await deleteTransaction(selectedTransaction.id).unwrap();
      } catch (err) {
        console.error("Wystąpił błąd podczas usuwania transakcji", err);
        dispatch(
          uiSliceActions.showNotification(
            new Notification(
              "error",
              `Błąd usuwania transakcji. ${JSON.stringify(error)}}`
            )
          )
        );
      }
    } else {
      console.warn("Brak wybranej transakcji do usunięcia");
    }
    setIsAlertOpen(false);
  };

  const handleCloseModal = () => {
    setSelectedTransaction(null);
    setIsModalOpen(false);
  };

  let content;

  switch (transactionsStatus) {
    case "pending":
      content = <Spinner text="Pobieranie transakcji..." />;
      break;
    case "success":
      if (transactionsCount > 0) {
        content = (
          <div className={styles["transactions-area"]}>
            {isAlertOpen && (
              <AlertDialog
                title="Usuwanie transakcji"
                message="Czy na pewno usunąć transakcję?"
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsAlertOpen(false)}
              />
            )}
            <Transactions
              onEditClick={handleEditTransaction}
              onDeleteClick={handleDeleteTransaction}
            />
            {isModalOpen && selectedTransaction && (
              <TransactionDetails
                transaction={selectedTransaction}
                onClose={handleCloseModal}
              />
            )}
          </div>
        );
      } else {
        content = <p>Brak transakcji w zadanym przedziale czasowym</p>;
      }
      break;
    case "error":
      content = <p>{transactionsError}</p>;
      break;
    default:
      break;
  }

  return <>{content}</>;
};

export default TransactionsArea;
