import styles from "./Spinner.module.css";

const Spinner = ({ text = "", size = "10em" }) => {
  const header = text ? <h4>{text}</h4> : null;
  return (
    <div className={styles.spinner}>
      {header}
      <div className={styles.loader} style={{ height: size, width: size }} />
    </div>
  );
};

export default Spinner;
