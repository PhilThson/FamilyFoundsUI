import React, { useState, useEffect } from "react";
import styles from "./CategoryProperty.module.css";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useAppSelector, useAppDispatch } from "../../../hooks/hooks";
import { fetchAllCategories } from "../../../store/category-actions";
import { ITransactionPropertyProps } from "../../../models/Main";

const CategoryProperty: React.FC<ITransactionPropertyProps> = ({
  name,
  initialValue,
  onValueChange,
}) => {
  const [value, setValue] = useState(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const categories = useAppSelector((state) => state.categories.categories);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  const handleEditClick = () => {
    setIsEditing((previous) => !previous);
    if (isEditing) {
      onValueChange(name, value);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(event.target.value);
  };

  let categoriesComboBox;
  if (categories && categories.length > 0) {
    const categoryOptions = categories.map((category) => (
      <option key={category.id} value={category.name}>
        {category.name}
      </option>
    ));
    categoriesComboBox = (
      <select id={name} value={value} onChange={handleChange}>
        <option value=""></option>
        {categoryOptions}
      </select>
    );
  } else {
    categoriesComboBox = (
      <div>
        <p className={styles["info-text"]}>
          Nie udało się pobrać listy kategorii
        </p>
      </div>
    );
  }

  return (
    <li key={name}>
      <div className={styles.property}>
        {/* className={isEditing ? "active" : undefined */}
        <span className={styles["property-name"]}>Kategoria</span>
        <span>
          {!isEditing ? (
            <span className={styles["property-value"]}>{value}</span>
          ) : (
            categoriesComboBox
          )}
          <button onClick={handleEditClick}>
            {isEditing ? <SaveIcon /> : <EditIcon />}
          </button>
        </span>
      </div>
    </li>
  );
};

export default CategoryProperty;
