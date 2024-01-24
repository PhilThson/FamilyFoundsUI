import { useState } from "react";
import Modal from "../../UI/Modal";
import styles from "./TransactionDetails.module.css";
import Property from "./Property";
import { ITransaction } from "../../../models/Main";
import CategoryProperty from "./CategoryProperty";
import { UpdateTransactionDto } from "../../../models/Update";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { updateTransaction } from "../../../store/transaction-actions";
import CurrencyProperty from "./CurrencyProperty";

interface ITransactionDetailsProps {
  transaction: ITransaction;
  onClose: () => void;
}

const TransactionDetails: React.FC<ITransactionDetailsProps> = ({
  transaction,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const updateTransactionStatus = useAppSelector(
    (state) => state.transactions.updateState.status
  );
  const updateTransactionError = useAppSelector(
    (state) => state.transactions.updateState.error
  );
  const [updatedTransaction, setUpdatedTransaction] =
    useState<UpdateTransactionDto>({
      id: transaction.id,
      title: transaction.title,
      contractor: transaction.contractor,
      account: transaction.account,
      amount: transaction.amount.toString(),
      currency: transaction.currency,
      description: transaction.description,
      date: transaction.date,
      postingDate: transaction.postingDate,
      categoryId: transaction.category?.id,
      contractorAccountNumber: transaction.contractorAccountNumber,
      contractorBankName: transaction.contractorBankName,
    });

  const handlePropertyChange = (name: string, value: string) => {
    setUpdatedTransaction((previous) => ({
      ...previous,
      [name]: value ?? undefined,
    }));
  };

  const handleSaveTransaction = () => {
    dispatch(updateTransaction(updatedTransaction));
  };

  return (
    <Modal onCloseModal={onClose}>
      <h2>Szczegóły transakcji</h2>
      <ul className={styles.details}>
        <Property
          name="title"
          displayName="Tytuł"
          initialValue={transaction.title}
          onValueChange={handlePropertyChange}
        />
        <Property
          name="contractor"
          displayName="Kontrahent"
          initialValue={transaction.contractor || ""}
          onValueChange={handlePropertyChange}
        />
        <Property
          name="account"
          displayName="Konto"
          initialValue={transaction.account || ""}
          onValueChange={handlePropertyChange}
        />
        <Property
          name="amount"
          displayName="Kwota"
          initialValue={transaction.amount.toFixed(2).toString()}
          type="number"
          onValueChange={handlePropertyChange}
        />
        <CurrencyProperty
          name="currency"
          initialValue={transaction.currency}
          onValueChange={handlePropertyChange}
        />
        <Property
          name="account"
          displayName="Konto"
          initialValue={transaction.account || ""}
          onValueChange={handlePropertyChange}
        />
        <Property
          name="description"
          displayName="Opis"
          initialValue={transaction.description || ""}
          onValueChange={handlePropertyChange}
        />
        <Property
          name="date"
          displayName="Data"
          initialValue={transaction.date.slice(0, 10)}
          type="date"
          onValueChange={handlePropertyChange}
        />
        <Property
          name="postingDate"
          displayName="Data zaksięgowania"
          initialValue={transaction.postingDate?.slice(0, 10) || ""}
          type="date"
          onValueChange={handlePropertyChange}
        />
        <Property
          name="contractorAccountNumber"
          displayName="Numer konta kontrahenta"
          initialValue={transaction.contractorAccountNumber || ""}
          onValueChange={handlePropertyChange}
        />
        <Property
          name="contractorBankName"
          displayName="Bank kontrahenta"
          initialValue={transaction.contractorBankName || ""}
          onValueChange={handlePropertyChange}
        />
        <CategoryProperty
          name="categoryId"
          initialValue={transaction.category}
          onValueChange={handlePropertyChange}
        />
      </ul>
      {updateTransactionStatus === "error" && (
        <p className={styles["error-text"]}>{updateTransactionError}</p>
      )}
      <div className={styles.actions}>
        <button
          className={styles["button-save"]}
          onClick={handleSaveTransaction}
          disabled={updateTransactionStatus === "pending"}
        >
          Zapisz
        </button>
        <button className={styles["button-close"]} onClick={onClose}>
          Zamknij
        </button>
      </div>
    </Modal>
  );
};

export default TransactionDetails;
