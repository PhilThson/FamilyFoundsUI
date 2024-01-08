import React from "react";
import Spinner from "../UI/Spinner";
import styles from "./CategoriesComboBox.module.css";
import { useAppSelector } from "../../hooks/hooks";

export interface CategoriesComboBoxProps {
  value: string;
  onSelectChange: (event: React.ChangeEvent) => void;
  onSelectBlur: () => void;
}

const CategoriesComboBox: React.FC<CategoriesComboBoxProps> = ({
  value,
  onSelectChange,
  onSelectBlur,
}) => {
  const categories = useAppSelector((state) => state.categories.categories);
  const categoriesStatus = useAppSelector((state) => state.categories.status);
  const categoriesError = useAppSelector((state) => state.categories.error);

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
      <div>
        <label htmlFor="categoryId">Kategoria</label>
        <select
          id="categoryId"
          value={value}
          onChange={onSelectChange}
          onBlur={onSelectBlur}
        >
          <option value=""></option>
          {categoryOptions}
        </select>
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
