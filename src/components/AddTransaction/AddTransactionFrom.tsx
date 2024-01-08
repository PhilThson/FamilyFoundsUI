import React, { useState, useEffect } from "react";
import Modal from "../UI/Modal";
import UserInput from "../UserInputArea/UserInput";
import styles from "./AddTransactionFrom.module.css";
import { CreateTransaction } from "../../models/Create";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { addNewTransaction } from "../../store/transaction-actions";
import { fetchAllCategories } from "../../store/category-actions";
import CategoriesComboBox from "../Dictionaries/CategoriesComboBox";

const AddTransactionFrom: React.FC<{ onModalClose: Function }> = ({
  onModalClose,
}) => {
  const [transaction, setTransaction] = useState<CreateTransaction>(
    new CreateTransaction()
  );
  const transactionStatus = useAppSelector(
    (state) => state.transactions.status
  );
  //const transactionError = useAppSelector((state) => state.transactions.error);

  const [isValid, setIsValid] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

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

    if (transactionStatus === "success") {
      setTransaction(new CreateTransaction());
      onModalClose();
    }
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
              id="amount"
              name="Kwota"
              type="number"
              value={transaction.amount}
              onChange={handleChange}
              onBlur={validateTransaction}
            />
          </div>
          <div className={styles["input-group"]}>
            <UserInput
              id="contractor"
              name="Kontrahent"
              type="text"
              value={transaction.contractor}
              onChange={handleChange}
              onBlur={validateTransaction}
            />
            <UserInput
              id="date"
              name="Data"
              type="date"
              value={transaction.date}
              onChange={handleChange}
              onBlur={validateTransaction}
            />
          </div>
          <div className={styles["input-group"]}>
            <UserInput
              id="description"
              name="Opis"
              type="text"
              value={transaction.description}
              onChange={handleChange}
              onBlur={validateTransaction}
            />
            <UserInput
              id="postingDate"
              name="Data zaksięgowania"
              type="date"
              value={transaction.postingDate}
              onChange={handleChange}
              onBlur={validateTransaction}
            />
          </div>
          <div className={styles["input-group"]}>
            <CategoriesComboBox
              value={transaction.categoryId}
              onSelectChange={handleChange}
              onSelectBlur={validateTransaction}
            />
          </div>
        </div>
        {}
        <div className={styles["form-actions"]}>
          <button
            type="submit"
            disabled={!isValid || transactionStatus === "pending"}
          >
            Dodaj
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTransactionFrom;
