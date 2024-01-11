import React, { useState, useEffect } from "react";
import Modal from "../UI/Modal";
import UserInput from "../UserInputArea/UserInput";
import styles from "./AddTransactionFrom.module.css";
import { CreateTransaction } from "../../models/Create";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { addNewTransaction } from "../../store/transaction-actions";
import { fetchAllCategories } from "../../store/category-actions";
import {
  stringHasValue,
  amountHasValue,
  dateHasValue,
  newTransactionIsValid,
} from "../../utils/validators";
import CategoriesComboBox from "../Dictionaries/CategoriesComboBox";

const AddTransactionFrom: React.FC<{ onModalClose: Function }> = ({
  onModalClose,
}) => {
  const [transaction, setTransaction] = useState<CreateTransaction>(
    new CreateTransaction()
  );
  const transactionError = useAppSelector(
    (state) => state.transactions.addNewError
  );
  const transactionStatus = useAppSelector(
    (state) => state.transactions.addNewStatus
  );

  const [isTouched, setIsTouched] = useState(false);
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

  const handleBlur = (event: React.FocusEvent<HTMLElement>) => {
    console.log(event);
    if (!isTouched) {
      setIsTouched(true);
    }
    const { id, value } = event.target as HTMLInputElement;
    validateTransaction(id, value);
  };

  const validateTransaction = (id: string, value: string) => {
    switch (id) {
      case "title":
        if (stringHasValue(value)) {
          setTitleIsValid(true);
        } else {
          setTitleIsValid(false);
        }
        break;
      case "amount":
        if (amountHasValue(value)) {
          setAmountIsValid(true);
        } else {
          setAmountIsValid(false);
        }
        break;
      case "contractor":
        if (stringHasValue(value)) {
          setContractorIsValid(true);
        } else {
          setContractorIsValid(false);
        }
        break;
      case "date":
        if (dateHasValue(value)) {
          setDateIsValid(true);
        } else {
          setDateIsValid(false);
        }
        break;
      default:
        console.log("Brak walidacji elementu o id: ", id);
        break;
    }
  };

  let transactionIsValid = false;
  if (
    titleIsValid &&
    amountIsValid &&
    contractorIsValid &&
    dateIsValid &&
    isTouched
  ) {
    transactionIsValid = true;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!transactionIsValid || !newTransactionIsValid(transaction)) {
      validateTransaction("title", transaction.title);
      validateTransaction("amount", transaction.amount);
      validateTransaction("contractor", transaction.contractor);
      validateTransaction("date", transaction.date);
      return;
    }
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
              isValid={titleIsValid}
              classes={styles.invalid}
              errorText="Tytuł jest wymagany"
              type="text"
              value={transaction.title}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <UserInput
              id="amount"
              name="Kwota"
              isValid={amountIsValid}
              classes={styles.invalid}
              errorText="Nieprawidłowa wartość kwoty"
              type="number"
              value={transaction.amount}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div className={styles["input-group"]}>
            <UserInput
              id="contractor"
              name="Kontrahent"
              isValid={contractorIsValid}
              classes={styles.invalid}
              errorText="Kontrahent jest wymagany"
              type="text"
              value={transaction.contractor}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <UserInput
              id="date"
              name="Data"
              isValid={dateIsValid}
              classes={styles.invalid}
              errorText="Nieprawidłowa data"
              type="date"
              value={transaction.date}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div className={styles["input-group"]}>
            <UserInput
              id="description"
              name="Opis"
              type="text"
              value={transaction.description}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <UserInput
              id="postingDate"
              name="Data zaksięgowania"
              type="date"
              value={transaction.postingDate}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div className={styles["input-group"]}>
            <CategoriesComboBox
              id="category"
              value={transaction.category}
              onSelectChange={handleChange}
              onSelectBlur={handleBlur}
            />
          </div>
        </div>
        {transactionStatus === "error" && (
          <p className={styles["error-text"]}>{transactionError}</p>
        )}
        <div className={styles["form-actions"]}>
          <button
            type="submit"
            disabled={!transactionIsValid || transactionStatus === "pending"}
          >
            Dodaj
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTransactionFrom;
