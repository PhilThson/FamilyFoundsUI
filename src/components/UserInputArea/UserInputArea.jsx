import { useState } from "react";
import UserInput from "./UserInput";
import AddTransactionButton from "./AddTransactionButton";

const DUMMY_INPUT = {
  startDate: "2023-01-01",
  endDate: "2023-12-31",
};

const UserInputArea = () => {
  const [dateRange, setDateRange] = useState(DUMMY_INPUT);
  const [isValidRange, setIsValidRange] = useState(true);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setDateRange((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const validateDateRange = () => {
    const { startDate, endDate } = dateRange;
    const isValid = new Date(startDate) <= new Date(endDate);
    setIsValidRange(isValid);
  };

  return (
    <>
      <section id="user-input">
        <div className="input-group">
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
          <p
            style={{ color: "red", fontSize: "0.75rem", marginTop: "0.25rem" }}
          >
            End date must be greater than or equal to start date.
          </p>
        )}
      </section>
      <AddTransactionButton isDisabled={!isValidRange} />
    </>
  );
};

export default UserInputArea;
