import React, { useEffect, useState } from "react";
import Modal from "../../UI/Modal";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { importTransactionsFromCsv } from "../../../store/transaction-actions";
import styles from "./ImportFromCsvForm.module.css";
import ImportSourceComboBox from "../../Dictionaries/ImportSourceComboBox";
import { fetchAllImportSources } from "../../../store/importSource-actions";
import Spinner from "../../UI/Spinner";
import { useGetImportSourcesQuery } from "../../../store/importSource-slice";

const ImportFromCsvForm: React.FC<{ onImportClose: () => void }> = ({
  onImportClose,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [importSourceId, setImportSourceId] = useState<number | null>(null);
  const [isInfoVisible, setIsInfoVisible] = useState<boolean>(false);

  const {
    data: importSources,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetImportSourcesQuery();

  const dispatch = useAppDispatch();
  // const importState = useAppSelector((state) => state.transactions.importState);

  // useEffect(() => {
  //   dispatch(fetchAllImportSources());
  // }, [dispatch]);

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file || !importSourceId) {
      console.error("Nie wskazano pliku lub źródła importu");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("importSourceId", importSourceId.toString());

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
            <ImportSourceComboBox
              value={importSourceId}
              onSelectChange={setImportSourceId}
            />
          </div>
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
        {isError && <p className="error-text">{error.toString()}</p>}
        {isInfoVisible && <p className="info-text">Należy wskazać plik .csv</p>}
        {isLoading && (
          <Spinner text="Trwa importowanie transakcji..." size="3rem" />
        )}
        <div className={styles["form-actions"]}>
          <button
            type="submit"
            disabled={!file || !importSourceId || isLoading}
          >
            Importuj
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ImportFromCsvForm;
