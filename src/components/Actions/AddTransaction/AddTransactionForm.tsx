import React, { useState } from "react";
import Modal from "../../UI/Modal";
import UserInput from "../../UserInputArea/UserInput";
import styles from "./AddTransactionForm.module.css";
import { CreateTransactionDto } from "../../../models/Create";
import { useAppDispatch } from "../../../hooks/hooks";
import { useAddTransactionMutation } from "../../../store/transaction-slice";
import { uiSliceActions } from "../../../store/ui-slice";
import {
  stringHasValue,
  amountHasValue,
  dateHasValue,
  newTransactionIsValid,
} from "../../../utils/validators";
import CategoriesComboBox from "../../Dictionaries/CategoriesComboBox";
import CurrencyComboBox from "../../Dictionaries/CurrencyComboBox";
import { IFetchError } from "../../../models/Main";

const initTransactionState: CreateTransactionDto = {
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
  categoryId: "",
};

const AddTransactionForm: React.FC<{ onModalClose: Function }> = ({
  onModalClose,
}) => {
  const [transaction, setTransaction] =
    useState<CreateTransactionDto>(initTransactionState);

  const [addTransaction, { error, isLoading, isError }] =
    useAddTransactionMutation();

  const [isTouched, setIsTouched] = useState(false);
  const [titleIsValid, setTitleIsValid] = useState(true);
  const [amountIsValid, setAmountIsValid] = useState(true);
  const [contractorIsValid, setContractorIsValid] = useState(true);
  const [dateIsValid, setDateIsValid] = useState(true);
  const dispatch = useAppDispatch();

  const showNotification = uiSliceActions.showNotification;

  const handleChange = (event: React.ChangeEvent) => {
    const { id, value } = event.target as HTMLInputElement;
    setTransaction((previous) => ({ ...previous, [id]: value ?? undefined }));
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!transactionIsValid || !newTransactionIsValid(transaction)) {
      validateTransaction("title", transaction.title);
      validateTransaction("amount", transaction.amount);
      validateTransaction("contractor", transaction.contractor);
      validateTransaction("date", transaction.date);
      return;
    }
    try {
      await addTransaction(transaction);
      dispatch(
        showNotification({
          status: "success",
          message: "Dodano transakcję",
        })
      );
      setTransaction(initTransactionState);
    } catch (err) {
      console.error("Błąd dodawania transakcji", err);
      dispatch(
        showNotification({
          status: "error",
          message: "Błąd dodawania transakcji",
        })
      );
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
              id="categoryId"
              value={transaction.categoryId || ""}
              onSelectChange={handleChange}
              onSelectBlur={handleBlur}
            />
          </div>
          <div className={styles["input-group"]}></div>
        </div>
        {isError && (
          <p className={styles["error-text"]}>{(error as IFetchError).error}</p>
        )}
        <div className={styles["form-actions"]}>
          <button type="submit" disabled={!transactionIsValid || isLoading}>
            Dodaj
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTransactionForm;
