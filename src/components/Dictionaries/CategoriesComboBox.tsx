import React, { useState } from "react";
import Spinner from "../UI/Spinner";
import styles from "./CategoriesComboBox.module.css";
import { ComboBoxProps } from "../../models/Main";
import { useGetCategoriesQuery } from "../../utils/api/api-slice";

const CategoriesComboBox: React.FC<ComboBoxProps> = ({
  id,
  value,
  isValid,
  errorText,
  onSelectChange,
  onSelectBlur,
}) => {
  const [isTouched, setIsTouched] = useState<boolean>(false);
  const {
    data: categories,
    isLoading,
    isSuccess,
    error,
  } = useGetCategoriesQuery();

  const handleBlur = (event: React.FocusEvent<HTMLElement>) => {
    if (!isTouched) {
      setIsTouched(true);
    }
    onSelectBlur(event);
  };

  let categoriesComboBox;
  if (isLoading) {
    categoriesComboBox = <Spinner text="Pobieranie kategorii..." size="3rem" />;
  } else if (isSuccess) {
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
    console.error("Wystąpił błąd podczas pobierania listy kategorii.", error);
    categoriesComboBox = (
      <div>
        <p className={styles["info-text"]}>{error?.toString()}</p>
      </div>
    );
  }
  return <>{categoriesComboBox}</>;
};

export default CategoriesComboBox;
