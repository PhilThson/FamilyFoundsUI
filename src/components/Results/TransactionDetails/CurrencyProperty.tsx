import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { ITransactionPropertyProps } from "../../../models/Main";
import { currencies } from "../../../models/Main";
import styles from "./CurrencyProperty.module.css";

const CurrencyProperty: React.FC<ITransactionPropertyProps> = ({
  name,
  initialValue,
  onValueChange,
}) => {
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing((previous) => !previous);
    if (isEditing) {
      onValueChange(name, value);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(event.target.value);
  };

  return (
    <li key={name}>
      <div className={styles.property}>
        <span className={styles["property-name"]}>Waluta</span>
        <span>
          {!isEditing ? (
            <span className={styles["property-value"]}>{value}</span>
          ) : (
            <select id={name} value={value} onChange={handleChange}>
              {currencies.map((currency) => (
                <option value={currency}>{currency}</option>
              ))}
            </select>
          )}
          <button onClick={handleEditClick}>
            {isEditing ? <SaveIcon /> : <EditIcon />}
          </button>
        </span>
      </div>
    </li>
  );
};

export default CurrencyProperty;
