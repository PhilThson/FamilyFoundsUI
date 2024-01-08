import React, { useState } from "react";
import Spinner from "../UI/Spinner";
import styles from "./CategoriesComboBox.module.css";
import { useAppSelector } from "../../hooks/hooks";

export interface CategoriesComboBoxProps {
  value: string;
  isValid?: boolean;
  errorText?: string;
  onSelectChange: (event: React.ChangeEvent) => void;
  onSelectBlur: (event: React.FocusEvent<HTMLElement>) => void;
}

const CategoriesComboBox: React.FC<CategoriesComboBoxProps> = ({
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
  } else if (categoriesStatus === "success" && categories.length > 0) {
    const categoryOptions = categories.map((category) => (
      <option key={category.id} value={category.id}>
        {category.name}
      </option>
    ));
    categoriesComboBox = (
      <div className={isValid === false ? styles.invalid : ""}>
        <label htmlFor="categoryId">Kategoria</label>
        <select
          id="categoryId"
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
  } else if (categoriesStatus === "error") {
    categoriesComboBox = (
      <div>
        <p className={styles["info-text"]}>{categoriesError}</p>
      </div>
    );
  } else {
    categoriesComboBox = (
      <div>
        <p className={styles["info-text"]}>Brak kategorii do wybrania</p>
      </div>
    );
  }
  return <>{categoriesComboBox}</>;
};

export default CategoriesComboBox;
