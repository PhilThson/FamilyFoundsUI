import { useState } from "react";
import styles from "./AddTransactionButton.module.css";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AddTransactionFrom from "./AddTransactionFrom";

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
      <div className={styles["button-container"]}>
        <button
          className={styles["add-button"]}
          onClick={handleAddTransactionClick}
        >
          <AddCircleOutlineIcon />
          <span>Dodaj transakcję</span>
        </button>
      </div>
      {isTransactionVisible && (
        <AddTransactionFrom onModalClose={handleCloseTransaction} />
      )}
    </>
  );
};

export default AddTransactionButton;
