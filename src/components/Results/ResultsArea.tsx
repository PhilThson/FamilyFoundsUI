import React from "react";
import TransactionsArea from "./TransactionsList/TransactionsArea";
import Summary from "./Summary/Summary";
import styles from "./ResultsArea.module.css";

const ResultsArea: React.FC = () => {
  return (
    <section className={styles.results}>
      <TransactionsArea />
      <Summary />
    </section>
  );
};

export default ResultsArea;
