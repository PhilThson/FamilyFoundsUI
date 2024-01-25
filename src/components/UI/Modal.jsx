import ReactDOM from "react-dom";
import styles from "./Modal.module.css";
import Card from "./Card";

const Backdrop = (props) => {
  return <div className={styles.backdrop} onClick={props.onClick} />;
};

const ModalOverlay = (props) => {
  return <Card className={styles.modal}>{props.children}</Card>;
};

const Modal = (props) => {
  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop onClick={props.onCloseModal} />,
        document.getElementById("backdrop-root")
      )}
      {ReactDOM.createPortal(
        <ModalOverlay onCloseModal={props.onCloseModal}>
          {props.children}
        </ModalOverlay>,
        document.getElementById("modal-root")
      )}
    </>
  );
};

export default Modal;
