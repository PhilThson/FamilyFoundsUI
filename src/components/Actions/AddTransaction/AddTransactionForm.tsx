import React, { useState, useEffect } from "react";
import Modal from "../../UI/Modal";
import UserInput from "../../UserInputArea/UserInput";
import styles from "./AddTransactionForm.module.css";
import { CreateTransactionDto } from "../../../models/Create";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { addNewTransaction } from "../../../store/transaction-actions";
import { fetchAllCategories } from "../../../store/category-actions";
import {
  stringHasValue,
  amountHasValue,
  dateHasValue,
  newTransactionIsValid,
} from "../../../utils/validators";
import CategoriesComboBox from "../../Dictionaries/CategoriesComboBox";
import CurrencyComboBox from "../../Dictionaries/CurrencyComboBox";

const AddTransactionForm: React.FC<{ onModalClose: Function }> = ({
  onModalClose,
}) => {
  const [transaction, setTransaction] = useState<CreateTransactionDto>({
    title: "",
    amount: "",
    currency: "PLN",
    account: "",
    contractor: "",
    date: new Date().toJSON().slice(0, 10),
    description: "",
    postingDate: "",
    contractorAccountNumber: "",
    contractorBankName: "",
    category: "",
  });
  const transactionError = useAppSelector(
    (state) => state.transactions.addNewState.error
  );
  const transactionStatus = useAppSelector(
    (state) => state.transactions.addNewState.status
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
    if (!isTouched) {
      setIsTouched(true);
    }
    const { id, value } = event.target as HTMLInputElement;
    validateTransaction(id, value);
  };

  const validateTransaction = (id: string, value: string) => {
    switch (id) {
      case "title":
        setTitleIsValid(stringHasValue(value));
        break;
      case "amount":
        setAmountIsValid(amountHasValue(value));
        break;
      case "contractor":
        setContractorIsValid(stringHasValue(value));
        break;
      case "date":
        setDateIsValid(dateHasValue(value));
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

    dispatch(addNewTransaction(transaction));
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
              invalidClass={styles.invalid}
              errorText="Tytuł jest wymagany"
              type="text"
              value={transaction.title}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div className={styles["input-group"]}>
            <UserInput
              id="contractor"
              name="Kontrahent"
              isValid={contractorIsValid}
              invalidClass={styles.invalid}
              errorText="Kontrahent jest wymagany"
              type="text"
              value={transaction.contractor}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div className={styles["input-group"]}>
            <UserInput
              id="account"
              name="Konto"
              type="text"
              value={transaction.account}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
          <div className={styles["input-group"]}>
            <UserInput
              id="amount"
              name="Kwota"
              isValid={amountIsValid}
              invalidClass={styles.invalid}
              errorText="Nieprawidłowa wartość kwoty"
              type="number"
              value={transaction.amount}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <CurrencyComboBox
              value={transaction.currency}
              onSelectChange={handleChange}
            />
          </div>
          <div className={styles["input-group"]}>
            <UserInput
              id="date"
              name="Data"
              isValid={dateIsValid}
              invalidClass={styles.invalid}
              errorText="Nieprawidłowa data"
              type="date"
              value={transaction.date}
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
            <UserInput
              id="contractorAccountNumber"
              name="Numer kontrahenta"
              type="text"
              value={transaction.contractorAccountNumber}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <UserInput
              id="contractorBankName"
              name="Bank kontrahenta"
              type="text"
              value={transaction.contractorBankName}
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
            <CategoriesComboBox
              id="category"
              value={transaction.category || ""}
              onSelectChange={handleChange}
              onSelectBlur={handleBlur}
            />
          </div>
          <div className={styles["input-group"]}></div>
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

export default AddTransactionForm;
