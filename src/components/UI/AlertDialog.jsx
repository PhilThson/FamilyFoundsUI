import ReactDOM from "react-dom";
import styles from "./AlertDialog.module.css";
import Card from "./Card";

const AlertDialogBackdrop = (props) => (
  <div className={styles.backdrop} onClick={props.onClick} />
);

const AlertDialogOverlay = (props) => (
  <Card className={styles.alert}>
    <h2>{props.title}</h2>
    <p>{props.message}</p>
    <div className={styles.buttonContainer}>
      <button onClick={props.onConfirm}>Tak</button>
      <button onClick={props.onCancel}>Nie</button>
    </div>
  </Card>
);

const AlertDialog = (props) => {
  return (
    <>
      {ReactDOM.createPortal(
        <AlertDialogBackdrop onClick={props.onCancel} />,
        document.getElementById("backdrop-root")
      )}
      {ReactDOM.createPortal(
        <AlertDialogOverlay
          title={props.title}
          message={props.message}
          onConfirm={props.onConfirm}
          onCancel={props.onCancel}
        />,
        document.getElementById("modal-root")
      )}
    </>
  );
};

export default AlertDialog;
