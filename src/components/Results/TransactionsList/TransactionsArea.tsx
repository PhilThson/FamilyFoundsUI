import { useState } from "react";
import { useAppDispatch } from "../../../hooks/hooks";
import Transactions from "./Transactions";
import TransactionDetails from "../TransactionDetails/TransactionDetails";
import Spinner from "../../UI/Spinner";
import { ITransaction, TransactionsAreaProps } from "../../../models/Main";
import { deleteTransaction } from "../../../store/transaction-actions";
import AlertDialog from "../../UI/AlertDialog";
import styles from "./TransactionsArea.module.css";

const TransactionsArea: React.FC<TransactionsAreaProps> = ({
  transactionsState,
}) => {
  const { status: transactionsStatus, error: transactionsError } =
    transactionsState;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<ITransaction | null>(null);

  const dispatch = useAppDispatch();

  const handleEditTransaction = (transaction: ITransaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDeleteTransaction = (transaction: ITransaction) => {
    setSelectedTransaction(transaction);
    setIsAlertOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedTransaction) {
      dispatch(deleteTransaction(selectedTransaction.id));
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
