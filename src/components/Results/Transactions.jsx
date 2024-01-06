import { useSelector } from "react-redux";
import {
  currencyFormatter as formatter,
  formatDate,
} from "../../utils/formatters";
import styles from "./Transactions.module.css";

const Transactions = ({ onEditClick }) => {
  const transactions = useSelector((state) => state.transactions.transactions);
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
                <button onClick={() => onEditClick(transaction)}>Edytuj</button>
                <button>Usuń</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Transactions;
