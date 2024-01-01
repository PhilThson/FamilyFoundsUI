import { useState } from "react";
import styles from "./Property.module.css";

const Property = ({ name, initialValue, onChangeValue }) => {
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing((previous) => !previous);
    if (isEditing) {
      onChangeValue(name, value);
    }
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <li className={isEditing ? "active" : undefined}>
      <div className={styles.property}>
        <span className={styles["property-name"]}>{name}</span>
        <span>
          {!isEditing ? (
            <span className={styles["property-value"]}>{value}</span>
          ) : (
            <input type="text" required value={value} onChange={handleChange} />
          )}
          <button onClick={handleEditClick}>
            {isEditing ? "Save" : "Edit"}
          </button>
        </span>
      </div>
    </li>
  );
};

export default Property;
