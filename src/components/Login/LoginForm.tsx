import Modal from "../UI/Modal";

const LoginForm: React.FC<{ onClose: Function }> = ({ onClose }) => {
  return <Modal onCloseModal={onClose}>Login</Modal>;
};

export default LoginForm;
