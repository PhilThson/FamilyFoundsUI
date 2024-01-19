import React, { useState } from "react";
import styles from "./ImportFromCsvButton.module.css";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import ImportFromCsvForm from "./ImportFromCsvForm";

const ImportFromCsvButton: React.FC = () => {
  const [isImportFormVisible, setIsImportFormVisible] = useState(false);

  const handleImportClick = () => {
    setIsImportFormVisible(true);
  };

  const handleCloseImport = () => {
    setIsImportFormVisible(false);
  };

  return (
    <>
      <button className={styles["import-button"]} onClick={handleImportClick}>
        <CloudUploadIcon />
        <span>Importuj z pliku .csv</span>
      </button>
      {isImportFormVisible && (
        <ImportFromCsvForm onImportClose={handleCloseImport} />
      )}
    </>
  );
};

export default ImportFromCsvButton;
