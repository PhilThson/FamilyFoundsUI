import { useState } from "react";
import Transactions from "./Transactions";
import TransactionDetails from "./TransactionDetails/TransactionDetails";

const ResultsArea = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const handleEditTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedTransaction(null);
    setIsModalOpen(false);
  };

  return (
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
};

export default ResultsArea;
