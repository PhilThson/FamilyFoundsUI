import { currencyFormatter as formatter } from "../utils/formatters";

const DUMMY_DATA = [
  {
    id: 1,
    amount: 12.0,
    contractor: "Kontrahent 1",
    title: "Tytuł 1",
    date: "2023-12-12",
  },
  {
    id: 2,
    amount: 122.2,
    contractor: "Kontrahent 2",
    title: "Tytuł 2",
    date: "2023-12-13",
  },
  {
    id: 3,
    amount: 111.8,
    contractor: "Kontrahent 3",
    title: "Tytuł 3",
    date: "2023-12-15",
  },
  {
    id: 4,
    amount: -14.0,
    contractor: "Kontrahent 4",
    title: "Tytuł 4",
    date: "2023-12-17",
  },
  {
    id: 5,
    amount: -12.6,
    contractor: "Kontrahent 5",
    title: "Tytuł 5",
    date: "2023-12-23",
  },
];

const Transactions = () => {
  return (
    <table id="result">
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
              <button>Edytuj</button>
              <button>Usuń</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Transactions;
