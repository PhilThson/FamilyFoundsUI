import { useState } from "react";
import LoginForm from "./LoginForm";
import styles from "./LoginButton.module.css";

const LoginButton: React.FC = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleCloseLoginForm = () => {
    setIsFormVisible(false);
  };

  const handleShowLoginForm = () => {
    setIsFormVisible(true);
  };

  return (
    <>
      <div className={styles["sticky-header"]}>
        <div className={styles["login-container"]}>
          <button
            onClick={handleShowLoginForm}
            className={styles["login-button"]}
          >
            Zaloguj
          </button>
        </div>
      </div>
      {isFormVisible && <LoginForm onClose={handleCloseLoginForm} />}
    </>
  );
};

export default LoginButton;
