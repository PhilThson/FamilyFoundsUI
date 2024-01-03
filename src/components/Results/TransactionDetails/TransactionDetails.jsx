import { useState } from "react";
import Modal from "../../UI/Modal";
import styles from "./TransactionDetails.module.css";
import Property from "./Property";

const TransactionDetails = ({ transaction, onClose }) => {
  const [updatedTransaction, setUpdatedTransaction] = useState(transaction);

  const handlePropertyChange = (name, value) => {
    setUpdatedTransaction((previous) => ({ ...previous, [name]: value }));
  };

  const handleSaveTransaction = () => {
    console.log("Saving transaction...");
    console.log(updatedTransaction);
  };

  return (
    <Modal onCloseModal={onClose}>
      <h2>Szczegóły transakcji</h2>
      <ul className={styles.details}>
        {Object.keys(transaction).map((propName, index) => (
          <Property
            key={index}
            name={propName}
            initialValue={transaction[propName]}
            onChangeValue={handlePropertyChange}
          />
        ))}
      </ul>
      <div className={styles.actions}>
        <button className={styles["button-close"]} onClick={onClose}>
          Zamknij
        </button>
        <button
          className={styles["button-save"]}
          onClick={handleSaveTransaction}
        >
          Zapisz
        </button>
      </div>
    </Modal>
  );
};

export default TransactionDetails;
