import { useState } from "react";
import { useAppSelector } from "../../hooks/hooks";
import Transactions from "./Transactions";
import TransactionDetails from "./TransactionDetails/TransactionDetails";
import Spinner from "../UI/Spinner";

const ResultsArea = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const transactionsStatus = useAppSelector(
    (state) => state.transactions.fetchAllStatus
  );
  const error = useAppSelector((state) => state.transactions.fetchAllError);

  const handleEditTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
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
        <Transactions onEditClick={handleEditTransaction} />
        {isModalOpen && (
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
