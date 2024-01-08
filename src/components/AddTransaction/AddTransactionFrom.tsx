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
  const transactionError = useAppSelector((state) => state.transactions.error);
  const transactionStatus = useAppSelector(
    (state) => state.transactions.status
  );

  const [titleIsValid, setTitleIsValid] = useState(true);
  const [amountIsValid, setAmountIsValid] = useState(true);
  const [contractorIsValid, setContractorIsValid] = useState(true);
  const [dateIsValid, setDateIsValid] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  const handleChange = (event: React.ChangeEvent) => {
    const { id, value } = event.target as HTMLInputElement;
    setTransaction((previous) => ({ ...previous, [id]: value }));
  };

  const validateTransaction = (event: React.FocusEvent<HTMLElement>) => {
    console.log(event);
    const { id, value } = event.target as HTMLInputElement;
    switch (id) {
      case "title":
        if (value.trim() === "") {
          setTitleIsValid(false);
        }
        break;
      case "amount":
        const val = value.trim();
        if (val === "0" || val === "0.0" || val === "") {
          setAmountIsValid(false);
        }
        break;
      case "contractor":
        if (value.trim() === "") {
          setContractorIsValid(false);
        }
        break;
      case "date":
        const timestamp = Date.parse(value);
        if (isNaN(timestamp)) {
          setDateIsValid(false);
        }
        break;
      default:
        console.log("Brak walidacji elementu o id: ", id);
        break;
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

  let isTransactionValid = false;
  if (titleIsValid && amountIsValid && contractorIsValid && dateIsValid) {
    isTransactionValid = true;
  }

  return (
    <Modal onCloseModal={onModalClose}>
      <h2 className={styles["transaction-header"]}>Dodaj nową transakcję</h2>
      <form onSubmit={handleSubmit}>
        <div className={styles["user-input"]}>
          <div className={styles["input-group"]}>
            <UserInput
              id="title"
              name="Tytuł"
              isValid={titleIsValid}
              errorText="Tytuł jest wymagany"
              type="text"
              value={transaction.title}
              onChange={handleChange}
              onBlur={validateTransaction}
            />
            <UserInput
              id="amount"
              name="Kwota"
              isValid={amountIsValid}
              errorText="Nieprawidłowa wartość kwoty"
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
              isValid={contractorIsValid}
              errorText="Kontrahent jest wymagany"
              type="text"
              value={transaction.contractor}
              onChange={handleChange}
              onBlur={validateTransaction}
            />
            <UserInput
              id="date"
              name="Data"
              isValid={dateIsValid}
              errorText="Nieprawidłowa data"
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
        {transactionStatus === "error" && (
          <p className={styles["error-text"]}>{transactionError}</p>
        )}
        <div className={styles["form-actions"]}>
          <button
            type="submit"
            disabled={!isTransactionValid || transactionStatus === "pending"}
          >
            Dodaj
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTransactionFrom;
