import Modal from "../UI/Modal";
import UserInput from "../UserInputArea/UserInput";
import { IAuthenticateRequest } from "../../models/Main";
import { ChangeEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";

import styles from "./LoginForm.module.css";

const LoginForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const loginState = useAppSelector((state) => state.auth.loginState);

  const [loginData, setLoginData] = useState<IAuthenticateRequest>({
    email: "",
    password: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginData((previous) => ({
      ...previous,
      [e.target.id]: e.target.value,
    }));
  };

  const validateLoginData = () => {};

  const handleLogin = () => {
    console.log(loginData);
  };

  return (
    <Modal
      onCloseModal={onClose}
      style={{ width: "25rem", left: "calc(50% - 12rem)" }}
    >
      <h2 style={{ paddingLeft: "1rem" }}>Logowanie</h2>
      <div className={styles["user-input"]}>
        <div className={styles["input-group"]}>
          <UserInput
            id="email"
            name="Email"
            type="email"
            isValid={true}
            value={loginData.email}
            onChange={handleInputChange}
            onBlur={validateLoginData}
            style={{ width: "250px" }}
          />
        </div>
        <div className={styles["input-group"]}>
          <UserInput
            id="password"
            name="Password"
            type="password"
            isValid={true}
            value={loginData.password}
            onChange={handleInputChange}
            onBlur={validateLoginData}
            style={{ width: "250px" }}
          />
        </div>
      </div>
      <div className={styles.actions}>
        <button
          className={styles["button-save"]}
          onClick={handleLogin}
          disabled={loginState.status === "pending"}
        >
          Zapisz
        </button>
        <button className={styles["button-close"]} onClick={onClose}>
          Zamknij
        </button>
      </div>
    </Modal>
  );
};

export default LoginForm;
