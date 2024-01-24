import React from "react";
import { useAppSelector } from "../../../hooks/hooks";
import styles from "./Summary.module.css";
import { Status } from "../../../models/Main";
import { formatAmount } from "../../../utils/formatters";

const Summary: React.FC<{ transactionsStatus: Status }> = (props) => {
  const { transactionsStatus } = props;
  const summaryData = useAppSelector((state) => state.transactions.summaryData);

  let content;

  if (transactionsStatus === "success") {
    content = (
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
    );
  }

  return <>{content}</>;
};

export default Summary;
