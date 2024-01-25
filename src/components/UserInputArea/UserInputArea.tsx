import { useState } from "react";
import { useAppDispatch } from "../../hooks/hooks";
import UserInput from "./UserInput";
import styles from "./UserInputArea.module.css";
import { fetchAllTransactions } from "../../store/transaction-actions";
import { IDateRange } from "../../models/Main";

const currentDate = new Date();
const oneMonthAgo = new Date();
oneMonthAgo.setMonth(currentDate.getMonth() - 1);

const INIT_DATERANGE: IDateRange = {
  startDate: oneMonthAgo.toJSON().slice(0, 10),
  endDate: currentDate.toJSON().slice(0, 10),
};

const UserInputArea = () => {
  const dispatch = useAppDispatch();
  const [dateRange, setDateRange] = useState(INIT_DATERANGE);
  const [isValidRange, setIsValidRange] = useState(true);

  const handleInputChange = (e: React.ChangeEvent) => {
    const { id, value } = e.target as HTMLInputElement;
    setDateRange((prev) => ({ ...prev, [id]: value }));
  };

  const validateDateRange = () => {
    const { startDate, endDate } = dateRange;
    const isValid = new Date(startDate) <= new Date(endDate);
    setIsValidRange(isValid);
  };

  const handleSearchClick = () => {
    dispatch(fetchAllTransactions(dateRange));
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
