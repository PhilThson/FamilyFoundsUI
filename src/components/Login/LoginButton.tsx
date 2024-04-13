import { useState } from "react";
import LoginForm from "./LoginForm";
import styles from "./LoginButton.module.css";
import { authSliceActions } from "../../store/auth-actions";
import { uiSliceActions } from "../../store/ui-slice";
import { Notification } from "../../models/Main";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";

const LoginButton: React.FC = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const { isLoggedIn, name: userName } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleCloseLoginForm = () => {
    setIsFormVisible(false);
    dispatch(authSliceActions.clearLoginState());
  };

  const handleShowLoginForm = () => {
    setIsFormVisible(true);
  };

  const handleLogout = () => {
    dispatch(authSliceActions.logout());
    dispatch(
      uiSliceActions.showNotification(
        new Notification("success", "Pomyślnie wylogowano użytkownika.")
      )
    );
  };

  let panelContent;
  if (isLoggedIn) {
    panelContent = (
      <div className={styles["logged-in"]}>
        <span>Witaj {userName}!</span>
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
