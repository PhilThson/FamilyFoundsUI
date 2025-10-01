import React from "react";
import { useAppSelector } from "../../../hooks/hooks";
import styles from "./Summary.module.css";
import { formatAmount } from "../../../utils/formatters";

const Summary: React.FC = () => {
  const transactionsState = useAppSelector(
    (state) => state.transactions.fetchAllState
  );
  const summaryData = useAppSelector((state) => state.transactions.summaryData);

  if (
    transactionsState.status !== "success" ||
    summaryData.transactionsCount === 0
  ) {
    return <></>;
  }
  return (
    <>
      <fieldset className={styles.summary}>
        <legend className={styles.title}>Podsumowanie</legend>
        <ul>
          {summaryData.categoriesCount.map((category) => (
            <li key={category.name}>
              <span>{category.name}</span>
              <span>{formatAmount(category.amount)}</span>
            </li>
          ))}
          <hr />
          <li key="total-debit" className={styles["total-debit"]}>
            <span>Razem</span>
            <span>{formatAmount(summaryData.totalDebit)}</span>
          </li>
          <li key="total-credit" className={styles["total-credit"]}>
            <span>Dochód</span>
            <span>{formatAmount(summaryData.totalCredit)}</span>
          </li>
          <li key="balance" className={styles.balance}>
            <span>Pozostało</span>
            <span>{formatAmount(summaryData.balance)}</span>
          </li>
        </ul>
      </fieldset>

      <fieldset className={styles.summary}>
        <legend className={styles.title}>Średnio na miesiąc</legend>
        <ul>
          {summaryData.averagePerMonth.categoriesCount.map((category) => (
            <li key={category.name}>
              <span>{category.name}</span>
              <span>{formatAmount(category.amount)}</span>
            </li>
          ))}
          <hr />
          <li className={styles["total-debit"]}>
            <span>Średni wydatek</span>
            <span>{formatAmount(summaryData.averagePerMonth.totalDebit)}</span>
          </li>
          <li className={styles["total-credit"]}>
            <span>Średni dochód</span>
            <span>{formatAmount(summaryData.averagePerMonth.totalCredit)}</span>
          </li>
          <li className={styles.balance}>
            <span>Średnio pozostaje</span>
            <span>{formatAmount(summaryData.averagePerMonth.balance)}</span>
          </li>
        </ul>
      </fieldset>
    </>
  );
};

export default Summary;
