import React, { useState } from "react";
import styles from "./Property.module.css";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { formatDate } from "../../../utils/formatters";

interface ITransactionPropertyProps {
  name: string;
  displayName?: string;
  initialValue: string;
  type?: string;
  onValueChange: (name: string, value: string) => void;
}

const Property: React.FC<ITransactionPropertyProps> = ({
  name,
  displayName,
  initialValue,
  type,
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

  const handleChange = (event: React.ChangeEvent) => {
    setValue((event.target as HTMLInputElement).value);
  };

  return (
    <li key={name}>
      <div className={styles.property}>
        {/* className={isEditing ? "active" : undefined */}
        <span className={styles["property-name"]}>
          {displayName ? displayName : name}
        </span>
        <span>
          {!isEditing ? (
            <span className={styles["property-value"]}>
              {name.toLowerCase().includes("date") ? formatDate(value) : value}
            </span>
          ) : (
            <input
              id={name}
              type={type ? type : "text"}
              required
              value={value}
              onChange={handleChange}
            />
          )}
          <button onClick={handleEditClick}>
            {isEditing ? <SaveIcon /> : <EditIcon />}
          </button>
        </span>
      </div>
    </li>
  );
};

export default Property;
