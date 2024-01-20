import React, { useState } from "react";
import { useAppSelector } from "../../hooks/hooks";
import { ImportSourceComboBoxProps } from "../../models/Main";
import Spinner from "../UI/Spinner";
import styles from "./ImportSourceComboBox.module.css";

const ImportSourceComboBox: React.FC<ImportSourceComboBoxProps> = (props) => {
  const { value, onSelectChange } = props;
  const [isTouched, setIsTouched] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean>(true);
  const importSources = useAppSelector(
    (state) => state.importSources.importSources
  );
  const importSourcesState = useAppSelector(
    (state) => state.importSources.fetchAllState
  );

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    const selectedSourceId = selectedValue ? Number(selectedValue) : null;
    if (!selectedSourceId) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
    onSelectChange(selectedSourceId);
  };

  let importSourcesComboBox;
  if (importSourcesState.status === "pending") {
    importSourcesComboBox = (
      <Spinner text="Pobieranie źródeł importu..." size="3rem" />
    );
  } else if (
    importSourcesState.status === "success" &&
    importSources.length > 0
  ) {
    const importSourceOptions = importSources.map((importSource) => (
      <option key={importSource.id} value={importSource.id}>
        {importSource.name}
      </option>
    ));
    importSourcesComboBox = (
      <div className={isValid === false ? styles.invalid : ""}>
        <label htmlFor="importSource"></label>
        <select
          id="importSource"
          value={value || ""}
          onChange={handleChange}
          onBlur={() => setIsTouched(true)}
        >
          <option value="" disabled>
            Wybierz źródło importu
          </option>
          {importSourceOptions}
        </select>
        {isValid === false && isTouched && (
          <p className={styles["error-text"]}>Należy wybrać źródło importu</p>
        )}
      </div>
    );
  } else if (importSourcesState.status === "error") {
    importSourcesComboBox = (
      <div>
        <p className="error-text">{importSourcesState.error}</p>
      </div>
    );
  } else {
    importSourcesComboBox = (
      <div>
        <p className="info-text">
          Brak źródeł importu do wybrania. Proszę odświeżyć formularz.
        </p>
      </div>
    );
  }
  return <>{importSourcesComboBox}</>;
};

export default ImportSourceComboBox;
