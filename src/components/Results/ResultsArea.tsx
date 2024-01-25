import React from "react";
import TransactionsArea from "./TransactionsList/TransactionsArea";
import Summary from "./Summary/Summary";
import styles from "./ResultsArea.module.css";
import { useAppSelector } from "../../hooks/hooks";

const ResultsArea: React.FC = () => {
  const transactionsState = useAppSelector(
    (state) => state.transactions.fetchAllState
  );
  const transactionsCount = useAppSelector(
    (state) => state.transactions.summaryData.transactionsCount
  );

  return (
    <section className={styles.results}>
      <TransactionsArea
        transactionsState={transactionsState}
        transactionsCount={transactionsCount}
      />
      <Summary transactionsStatus={transactionsState.status} />
    </section>
  );
};

export default ResultsArea;
