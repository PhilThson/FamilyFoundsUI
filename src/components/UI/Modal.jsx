import ReactDOM from "react-dom";
import styles from "./Modal.module.css";
import Card from "./Card";

const Backdrop = (props) => {
  return <div className={styles.backdrop} onClick={props.onClick} />;
};

const ModalOverlay = ({ children, ...rest }) => {
  return (
    <Card className={styles.modal} {...rest}>
      {children}
    </Card>
  );
};

const Modal = ({ onCloseModal, children, ...rest }) => {
  return (
    <>
      {ReactDOM.createPortal(
        <Backdrop onClick={onCloseModal} />,
        document.getElementById("backdrop-root")
      )}
      {ReactDOM.createPortal(
        <ModalOverlay {...rest}>{children}</ModalOverlay>,
        document.getElementById("modal-root")
      )}
    </>
  );
};

export default Modal;
