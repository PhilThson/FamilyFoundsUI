import styles from "./AddTransactionButton.module.css";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const AddTransactionButton = ({ isDisabled }) => {
  const handleAddTransaction = () => {
    // Perform action for adding transaction here
    console.log("Adding transaction:");
  };

  return (
    <div className={styles.buttonContainer}>
      <button
        className={styles.addButton}
        onClick={handleAddTransaction}
        disabled={isDisabled}
      >
        <AddCircleOutlineIcon />
        <span>Dodaj transakcję</span>
      </button>
    </div>
  );
};

export default AddTransactionButton;
