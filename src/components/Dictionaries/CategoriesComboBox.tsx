import React, { useState } from "react";
import Spinner from "../UI/Spinner";
import styles from "./CategoriesComboBox.module.css";
import { useAppSelector } from "../../hooks/hooks";
import { ComboBoxProps } from "../../models/Main";

const CategoriesComboBox: React.FC<ComboBoxProps> = ({
  id,
  value,
  isValid,
  errorText,
  onSelectChange,
  onSelectBlur,
}) => {
  const [isTouched, setIsTouched] = useState<boolean>(false);
  const categories = useAppSelector((state) => state.categories.categories);
  const categoriesStatus = useAppSelector((state) => state.categories.status);
  const categoriesError = useAppSelector((state) => state.categories.error);

  const handleBlur = (event: React.FocusEvent<HTMLElement>) => {
    if (!isTouched) {
      setIsTouched(true);
    }
    onSelectBlur(event);
  };

  let categoriesComboBox;
  if (categoriesStatus === "pending") {
    categoriesComboBox = <Spinner text="Pobieranie kategorii..." size="3rem" />;
  } else if (categoriesStatus === "success") {
    const categoryOptions = categories.map((category) => (
      <option key={category.id} value={category.id}>
        {category.name}
      </option>
    ));
    categoriesComboBox = (
      <div className={isValid === false ? styles.invalid : ""}>
        <label htmlFor={id}>Kategoria</label>
        <select
          id={id}
          value={value}
          onChange={onSelectChange}
          onBlur={handleBlur}
        >
          <option value=""></option>
          {categoryOptions}
        </select>
        {isValid === false && isTouched && (
          <p className={styles["error-text"]}>{errorText}</p>
        )}
      </div>
    );
  } else {
    categoriesComboBox = (
      <div>
        <p className={styles["info-text"]}>{categoriesError}</p>
      </div>
    );
  }
  return <>{categoriesComboBox}</>;
};

export default CategoriesComboBox;
