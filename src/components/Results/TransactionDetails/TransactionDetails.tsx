import { useState } from "react";
import Modal from "../../UI/Modal";
import styles from "./TransactionDetails.module.css";
import Property from "./Property";
import { ITransaction } from "../../../models/Main";
import CategoryProperty from "./CategoryProperty";
import { UpdateTransactionDto } from "../../../models/Update";

interface ITransactionDetailsProps {
  transaction: ITransaction;
  onClose: () => void;
}

const TransactionDetails: React.FC<ITransactionDetailsProps> = ({
  transaction,
  onClose,
}) => {
  const [updatedTransaction, setUpdatedTransaction] =
    useState<UpdateTransactionDto>({
      id: transaction.id,
      title: transaction.title,
      contractor: transaction.contractor,
      amount: transaction.amount.toString(),
      description: transaction.description,
      date: transaction.date,
      postingDate: transaction.postingDate,
      category: transaction.category?.name,
    });

  const handlePropertyChange = (name: string, value: string) => {
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
        <Property
          name={"title"}
          displayName="Tytuł"
          initialValue={transaction.title}
          onValueChange={handlePropertyChange}
        />
        <Property
          name={"contractor"}
          displayName="Kontrahent"
          initialValue={transaction.contractor}
          onValueChange={handlePropertyChange}
        />
        <Property
          name={"amount"}
          displayName="Kwota"
          initialValue={transaction.amount.toString()}
          type="number"
          onValueChange={handlePropertyChange}
        />
        <Property
          name={"description"}
          displayName="Opis"
          initialValue={transaction.description || ""}
          onValueChange={handlePropertyChange}
        />
        <Property
          name={"date"}
          displayName="Data"
          initialValue={transaction.date.slice(0, 10)}
          type="date"
          onValueChange={handlePropertyChange}
        />
        <Property
          name={"postingDate"}
          displayName="Data zaksięgowania"
          initialValue={transaction.postingDate?.slice(0, 10) || ""}
          type="date"
          onValueChange={handlePropertyChange}
        />
        <CategoryProperty
          name={"category"}
          initialValue={transaction.category?.name || ""}
          onValueChange={handlePropertyChange}
        />
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
