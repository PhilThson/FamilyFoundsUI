import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import Transactions from "./Transactions";
import TransactionDetails from "./TransactionDetails/TransactionDetails";
import Spinner from "../UI/Spinner";
import { ITransaction } from "../../models/Main";
import { deleteTransaction } from "../../store/transaction-actions";
import AlertDialog from "../UI/AlertDialog";

const ResultsArea: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<ITransaction | null>(null);
  const transactionsStatus = useAppSelector(
    (state) => state.transactions.fetchAllStatus
  );
  const error = useAppSelector((state) => state.transactions.fetchAllError);
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

  if (transactionsStatus === "pending") {
    content = <Spinner text="Pobieranie transakcji..." />;
  } else if (transactionsStatus === "success") {
    content = (
      <>
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
      </>
    );
  } else if (transactionsStatus === "error") {
    content = <p>{error}</p>;
  }

  return <>{content}</>;
};

export default ResultsArea;
