import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { fetchAllCategories } from "../../../store/category-actions";
import styles from "./Summary.module.css";
import { Status } from "../../../models/Main";
import { formatAmount } from "../../../utils/formatters";

const Summary: React.FC<{ transactionsStatus: Status }> = (props) => {
  const { transactionsStatus } = props;
  const categories = useAppSelector((state) => state.categories.categories);
  const summaryData = useAppSelector((state) => state.transactions.summaryData);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  let content;

  if (transactionsStatus === "success" && categories) {
    content = (
      <fieldset className={styles.summary}>
        <legend className={styles.title}>Podsumowanie</legend>
        <ul>
          {categories.map((category) => (
            <li key={category.id}>
              <span>{category.name}</span>
              <span>777.22</span>
            </li>
          ))}
          <li key="none">
            <span>Brak</span>
            <span>999.99</span>
          </li>
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
