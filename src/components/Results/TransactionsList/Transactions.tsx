import { formatDate, formatAmount } from "../../../utils/formatters";
import styles from "./Transactions.module.css";
import { ITransaction } from "../../../models/Main";
import { useAppSelector } from "../../../hooks/hooks";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useState } from "react";
import { orderByCategory, orderByDate } from "../../../utils/sorters";

interface TransactionListProps {
  onEditClick: (transaction: ITransaction) => void;
  onDeleteClick: (transaction: ITransaction) => void;
}

interface ISortable {
  column: string;
  ascending: boolean;
}

const Transactions: React.FC<TransactionListProps> = (props) => {
  const { onEditClick, onDeleteClick } = props;
  const transactions = useAppSelector(
    (state) => state.transactions.transactions
  );

  const [orderedTransactions, setOrderedTransactions] = useState<
    ITransaction[]
  >(orderByDate(transactions, true));

  const [sortedBy, setSortedBy] = useState<ISortable>({
    column: "date",
    ascending: true,
  });

  const handleOrderByDate = () => {
    console.log("Order by date invoked.");
    setSortedBy((previous) => ({
      column: "date",
      ascending: !previous.ascending,
    }));
    setOrderedTransactions((previous) =>
      orderByDate(previous, !sortedBy.ascending)
    );
  };

  const handleOrderByCategory = () => {
    setSortedBy((prev) => ({ column: "category", ascending: !prev.ascending }));
    setOrderedTransactions((previous) =>
      orderByCategory(previous, !sortedBy.ascending)
    );
  };

  return (
    <table className={styles.transactions}>
      <thead>
        <tr>
          <th
            onClick={handleOrderByDate}
            className={
              sortedBy.column === "date"
                ? sortedBy.ascending
                  ? styles["sorted-asc"]
                  : styles["sorted-desc"]
                : ""
            }
          >
            <div className={styles.sortable}>
              <span>Data</span>
              <span className={styles["sort-arrow"]}></span>
            </div>
          </th>
          <th>Kontrahent</th>
          <th>Tytuł</th>
          <th>Kwota</th>
          <th
            onClick={handleOrderByCategory}
            className={
              sortedBy.column === "category"
                ? sortedBy.ascending
                  ? styles["sorted-asc"]
                  : styles["sorted-desc"]
                : ""
            }
          >
            <div className={styles.sortable}>
              <span>Kategoria</span>
              <span className={styles["sort-arrow"]}></span>
            </div>
          </th>
          <th>Akcje</th>
        </tr>
      </thead>
      <tbody>
        {orderedTransactions.map((transaction) => (
          <tr key={transaction.id}>
            <td>{formatDate(transaction.date)}</td>
            <td>{transaction.contractor?.substring(0, 30) || "Brak"}</td>
            <td>{transaction.title?.substring(0, 30) || "Brak"}</td>
            <td>{formatAmount(transaction.amount, transaction.currency)}</td>
            <td>
              {transaction.amount >= 0
                ? "Przychód"
                : transaction.category?.name || "Brak"}
            </td>
            <td>
              <div className={styles.actions}>
                <button
                  className={styles.editButton}
                  onClick={() => onEditClick(transaction)}
                >
                  {<EditIcon />}
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => onDeleteClick(transaction)}
                >
                  {<DeleteIcon />}
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Transactions;
