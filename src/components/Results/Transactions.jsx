import { currencyFormatter as formatter } from "../../utils/formatters";
import { DUMMY_DATA } from "../../utils/dataStub";
import styles from "./Transactions.module.css";

const Transactions = ({ onEditClick }) => {
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
          {DUMMY_DATA.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.date}</td>
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
