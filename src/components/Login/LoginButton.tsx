import { useState } from "react";
import LoginForm from "./LoginForm";
import styles from "./LoginButton.module.css";
import { authSliceActions } from "../../store/auth-actions";
import { uiSliceActions } from "../../store/ui-slice";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import { transactionActions } from "../../store/transaction-slice";

const LoginButton: React.FC = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const authState = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const handleCloseLoginForm = () => {
    setIsFormVisible(false);
  };

  const handleShowLoginForm = () => {
    setIsFormVisible(true);
  };

  const handleLogout = () => {
    dispatch(authSliceActions.clearLoginState());
    dispatch(transactionActions.clearTransactionsState());
    dispatch(
      uiSliceActions.showNotification({
        status: "success",
        message: "Pomyślnie wylogowano użytkownika.",
      })
    );
  };

  let panelContent;
  if (authState.isLoggedIn) {
    panelContent = (
      <div className={styles["logged-in"]}>
        <span>Witaj {authState.name}!</span>
        <button onClick={handleLogout} className={styles["link-button"]}>
          Wyloguj
        </button>
      </div>
    );
  } else {
    panelContent = (
      <button onClick={handleShowLoginForm} className={styles["link-button"]}>
        Zaloguj
      </button>
    );
  }

  return (
    <>
      <div className={styles["sticky-header"]}>
        <div className={styles["login-container"]}>{panelContent}</div>
      </div>
      {isFormVisible && <LoginForm onClose={handleCloseLoginForm} />}
    </>
  );
};

export default LoginButton;
