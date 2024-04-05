import { useAppSelector } from "../../hooks/hooks";
import { ImportSourceComboBoxProps } from "../../models/Main";
import Spinner from "../UI/Spinner";
import { useGetImportSourcesQuery } from "../../store/importSource-slice";

const ImportSourceComboBox: React.FC<ImportSourceComboBoxProps> = (props) => {
  const { value, onSelectChange } = props;
  // const importSources = useAppSelector(
  //   (state) => state.importSources.importSources
  // );
  // const importSourcesState = useAppSelector(
  //   (state) => state.importSources.fetchAllState
  // );
  const {
    data: importSources,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetImportSourcesQuery();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    const selectedSourceId = selectedValue ? Number(selectedValue) : null;
    onSelectChange(selectedSourceId);
  };

  let importSourcesComboBox;
  if (isLoading) {
    importSourcesComboBox = (
      <Spinner text="Pobieranie źródeł importu..." size="3rem" />
    );
  } else if (isSuccess && importSources.length > 0) {
    const importSourceOptions = importSources.map((importSource) => (
      <option key={importSource.id} value={importSource.id}>
        {importSource.name}
      </option>
    ));
    importSourcesComboBox = (
      <div>
        <label htmlFor="importSource">Źródło importu</label>
        <select id="importSource" value={value || ""} onChange={handleChange}>
          <option value="" disabled>
            Wybierz źródło importu
          </option>
          {importSourceOptions}
        </select>
      </div>
    );
  } else if (isError) {
    importSourcesComboBox = (
      <div>
        <p className="error-text">{error?.toString()}</p>
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
