import { useState } from "react";
import styles from "./AddTransactionButton.module.css";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddTransactionForm from "./AddTransactionForm";

const AddTransactionButton: React.FC = () => {
  const [isTransactionVisible, setIsTransactionVisible] = useState(false);

  const handleAddTransactionClick = () => {
    setIsTransactionVisible(true);
  };

  const handleCloseTransaction = () => {
    setIsTransactionVisible(false);
  };

  return (
    <>
      <button
        className={styles["add-button"]}
        onClick={handleAddTransactionClick}
      >
        <AddCircleOutlineIcon />
        <span>Dodaj transakcję</span>
      </button>
      {isTransactionVisible && (
        <AddTransactionForm onModalClose={handleCloseTransaction} />
      )}
    </>
  );
};

export default AddTransactionButton;
