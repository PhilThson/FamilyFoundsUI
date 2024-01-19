import React, { useState } from "react";
import Modal from "../../UI/Modal";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { importTransactionsFromCsv } from "../../../store/transaction-actions";
import styles from "./ImportFromCsvForm.module.css";

const ImportFromCsvForm: React.FC<{ onImportClose: () => void }> = ({
  onImportClose,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isInfoVisible, setIsInfoVisible] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const importState = useAppSelector((state) => state.transactions.importState);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      const isCsvFile = selectedFile.name.toLowerCase().endsWith(".csv");
      if (isCsvFile) {
        setFile(selectedFile);
        setIsInfoVisible(false);
      } else {
        console.error("Nieprawidłowy typ pliku. Proszę wybrać plik .csv");
        setIsInfoVisible(true);
        setFile(null);
      }
    } else {
      setIsInfoVisible(false);
      setFile(null);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      console.error("Nie wskazano pliku");
      setIsInfoVisible(true);
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    dispatch(importTransactionsFromCsv(formData));
  };

  return (
    <Modal onCloseModal={onImportClose}>
      <h2 className={styles["import-header"]}>
        Import transakcji z pliku .csv
      </h2>
      <form onSubmit={handleSubmit} id="form">
        <div className={styles["user-input"]}>
          <div className={styles["input-group"]}>
            <label htmlFor="importFile">Wybierz plik do importu</label>
            <input
              id="importFile"
              type="file"
              name="file"
              onChange={handleFileChange}
            />
          </div>
        </div>
        {importState.status === "error" && (
          <p className="error-text">{importState.error}</p>
        )}
        {isInfoVisible && <p className="info-text">Należy wskazać plik .csv</p>}
        <div className={styles["form-actions"]}>
          <button
            type="submit"
            disabled={file === null || importState.status === "pending"}
          >
            Importuj
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ImportFromCsvForm;
