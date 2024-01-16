import {
  currencyFormatter as formatter,
  formatDate,
} from "../../utils/formatters";
import styles from "./Transactions.module.css";
import { ITransaction } from "../../models/Main";
import { useAppSelector } from "../../hooks/hooks";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

interface TransactionListProps {
  onEditClick: (transaction: ITransaction) => void;
  onDeleteClick: (transaction: ITransaction) => void;
}

const Transactions: React.FC<TransactionListProps> = (props) => {
  const { onEditClick, onDeleteClick } = props;
  const transactions = useAppSelector(
    (state) => state.transactions.transactions
  );
  const orderedTransactions = transactions
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <table className={styles.result}>
        <thead>
          <tr>
            <th>Data</th>
            <th>Kontrahent</th>
            <th>Tytuł</th>
            <th>Kwota</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {orderedTransactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{formatDate(transaction.date)}</td>
              <td>{transaction.contractor}</td>
              <td>{transaction.title}</td>
              <td>{formatter.format(transaction.amount)}</td>
              <td>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Transactions;
