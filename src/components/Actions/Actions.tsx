import styles from "./Actions.module.css";
import AddTransactionButton from "./AddTransaction/AddTransactionButton";
import ImportFromCsvButton from "./ImportFromCsv/ImportFromCsvButton";

const Actions: React.FC = () => {
  return (
    <section className={styles["actions-container"]}>
      <AddTransactionButton />
      <ImportFromCsvButton />
    </section>
  );
};

export default Actions;
