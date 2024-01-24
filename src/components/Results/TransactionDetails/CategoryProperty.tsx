import React, { useState, useEffect } from "react";
import styles from "./CategoryProperty.module.css";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useAppSelector, useAppDispatch } from "../../../hooks/hooks";
import { fetchAllCategories } from "../../../store/category-actions";
import { ICategory, ICategoryPropertyProps } from "../../../models/Main";

const CategoryProperty: React.FC<ICategoryPropertyProps> = ({
  name,
  initialValue,
  onValueChange,
}) => {
  const [category, setCategory] = useState<ICategory | undefined>(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const categories = useAppSelector((state) => state.categories.categories);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  const handleEditClick = () => {
    setIsEditing((previous) => !previous);
    if (isEditing) {
      onValueChange(name, category?.id.toString() ?? "");
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const choice = categories.find(
      (category) => category.id === +event.target.value
    );
    if (choice) {
      setCategory(choice);
    }
  };

  let categoriesComboBox;
  if (categories && categories.length > 0) {
    const categoryOptions = categories.map((category) => (
      <option key={category.id} value={category.id}>
        {category.name}
      </option>
    ));
    categoriesComboBox = (
      <select id={name} value={category?.id} onChange={handleChange}>
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
        <span className={styles["property-name"]}>Kategoria</span>
        <span>
          {!isEditing ? (
            <span className={styles["property-value"]}>{category?.name}</span>
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
