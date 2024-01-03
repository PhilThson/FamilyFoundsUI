import React, { useState } from "react";
import Modal from "../UI/Modal";
import UserInput from "../UserInputArea/UserInput";
import styles from "./AddTransactionFrom.module.css";
import { CreateTransaction } from "../../models/Create";

const AddTransactionFrom: React.FC<{ onModalClose: Function }> = ({
  onModalClose,
}) => {
  const [transaction, setTransaction] = useState<CreateTransaction | null>(
    null
  );

  const handleChange = (event: React.ChangeEvent) => {
    const { id, value } = event.target as HTMLInputElement;
    setTransaction((previous) => ({ ...previous, [id]: value }));
  };

  const validateTransaction = () => {};

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Sending new transaction...");
    console.log(transaction);
  };

  return (
    <Modal onCloseModal={onModalClose}>
      <h2 className={styles["transaction-header"]}>Dodaj nową transakcję</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles["user-input"]}>
          <div className={styles["input-group"]}>
            <UserInput
              id="title"
              name="Tytuł"
              type="text"
              value={transaction?.title}
              onChange={handleChange}
              onBlur={validateTransaction}
            />
            <UserInput
              id="contractor"
              name="Kontrahent"
              type="text"
              value={transaction?.contractor}
              onChange={handleChange}
              onBlur={validateTransaction}
            />
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default AddTransactionFrom;
