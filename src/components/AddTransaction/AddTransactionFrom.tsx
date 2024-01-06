import React, { useState } from "react";
import Modal from "../UI/Modal";
import UserInput from "../UserInputArea/UserInput";
import styles from "./AddTransactionFrom.module.css";
import { CreateTransaction } from "../../models/Create";
import { useAppDispatch } from "../../hooks/hooks";
import { addNew as addNewTransaction } from "../../store/transaction-actions";

const AddTransactionFrom: React.FC<{ onModalClose: Function }> = ({
  onModalClose,
}) => {
  const [transaction, setTransaction] = useState<CreateTransaction>(
    new CreateTransaction()
  );
  const [isValid, setIsValid] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  const handleChange = (event: React.ChangeEvent) => {
    const { id, value } = event.target as HTMLInputElement;
    setTransaction((previous) => ({ ...previous, [id]: value }));
  };

  const validateTransaction = () => {
    if (!transaction) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Sending new transaction...");
    console.log(transaction);
    dispatch(addNewTransaction(transaction!));
    onModalClose();
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
              value={transaction.title}
              onChange={handleChange}
              onBlur={validateTransaction}
            />
            <UserInput
              id="contractor"
              name="Kontrahent"
              type="text"
              value={transaction.contractor}
              onChange={handleChange}
              onBlur={validateTransaction}
            />
          </div>
        </div>
        <button type="submit" disabled={!isValid}>
          Dodaj
        </button>
      </form>
    </Modal>
  );
};

export default AddTransactionFrom;
