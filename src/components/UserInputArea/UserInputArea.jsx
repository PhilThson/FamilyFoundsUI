import { useState } from "react";
import { useAppDispatch } from "../../hooks/hooks";
import UserInput from "./UserInput";
import styles from "./UserInputArea.module.css";
import { fetchAllTransactions } from "../../store/transaction-actions";
//import { transactionActions } from "../../store/transaction-slice";

const INIT_DATERANGE = {
  startDate: "2024-01-01",
  endDate: "2024-12-31",
};

const UserInputArea = () => {
  const dispatch = useAppDispatch();
  //const isResultsVisible = useAppSelector((state) => state.transactions.isVisible);
  const [dateRange, setDateRange] = useState(INIT_DATERANGE);
  const [isValidRange, setIsValidRange] = useState(true);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setDateRange((prev) => ({ ...prev, [id]: value }));
  };

  const validateDateRange = () => {
    const { startDate, endDate } = dateRange;
    const isValid = new Date(startDate) <= new Date(endDate);
    setIsValidRange(isValid);
  };

  const handleSearchClick = () => {
    dispatch(fetchAllTransactions());
    // if (!isResultsVisible) {
    //   dispatch(transactionActions.toggle());
    // }
  };

  return (
    <section className={styles["user-input"]}>
      <div className={styles["input-group"]}>
        <UserInput
          id="startDate"
          name="Data początkowa"
          type="date"
          value={dateRange.startDate}
          onChange={handleInputChange}
          onBlur={validateDateRange}
        />
        <UserInput
          id="endDate"
          name="Data końcowa"
          type="date"
          value={dateRange.endDate}
          onChange={handleInputChange}
          onBlur={validateDateRange}
        />
      </div>
      {!isValidRange && (
        <p className={styles["validation-message"]}>
          Data końcowa musi być większa lub równa dacie początkowej.
        </p>
      )}
      <button
        className={styles["search-button"]}
        onClick={handleSearchClick}
        disabled={!isValidRange}
      >
        Wyszukaj
      </button>
    </section>
  );
};

export default UserInputArea;
