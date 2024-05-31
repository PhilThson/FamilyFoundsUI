import Modal from "../UI/Modal";
import UserInput from "../UserInputArea/UserInput";
import { IAuthenticateRequest, IFetchError } from "../../models/Main";
import { ChangeEvent, useState } from "react";
import { useAppDispatch } from "../../hooks/hooks";
import sha256 from "crypto-js/sha256";
import { useLoginMutation } from "../../store/auth-slice";

import styles from "./LoginForm.module.css";
import Spinner from "../UI/Spinner";
import { uiSliceActions } from "../../store/ui-slice";

const initLoginData = {
  email: "",
  password: "",
};
const emailRegex = new RegExp("^[^@]+@[^@]+.[^@]+$");

const LoginForm: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const dispatch = useAppDispatch();

  const [loginData, setLoginData] =
    useState<IAuthenticateRequest>(initLoginData);
  const [isTouched, setIsTouched] = useState(false);
  const [emailIsValid, setEmailIsValid] = useState(true);
  const [passwordIsValid, setPasswordIsValid] = useState(true);

  const [logIn, { isLoading, isError, error }] = useLoginMutation();

  const handleClose = () => {
    setLoginData(initLoginData);
    onClose();
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginData((previous) => ({
      ...previous,
      [e.target.id]: e.target.value,
    }));
  };

  const handleBlur = (event: React.FocusEvent<HTMLElement>) => {
    if (!isTouched) {
      setIsTouched(true);
    }
    const { id, value } = event.target as HTMLInputElement;
    validateLoginData(id, value);
  };

  const validateLoginData = (id: string, value: string) => {
    if (id === "email") {
      setEmailIsValid(emailRegex.test(value));
    } else {
      setPasswordIsValid(value.length >= 6);
    }
  };

  let loginDataIsValid = false;
  if (emailIsValid && passwordIsValid && isTouched) {
    loginDataIsValid = true;
  }

  let statusContent;
  if (isLoading) {
    statusContent = <Spinner text="Logowanie..." />;
  } else if (isError) {
    statusContent = (
      <p className="error-text">{`Wystąpił błąd podczas logowania. (${
        (error as IFetchError).error
      })`}</p>
    );
  }

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!loginDataIsValid) {
      validateLoginData("email", loginData.email);
      validateLoginData("password", loginData.password);
      return;
    }

    const authRequest: IAuthenticateRequest = {
      email: loginData.email,
      password: sha256(loginData.password + "/T}qRj&)T-89i}").toString(),
    };
    try {
      await logIn(authRequest).unwrap();
      dispatch(
        uiSliceActions.showNotification({
          status: "success",
          message: "Zalogowano!",
        })
      );
    } catch (err) {
      console.error("Wystąpił błąd podczas logowania.", err);
    }
    setLoginData(initLoginData);
  };

  return (
    <Modal
      onCloseModal={handleClose}
      style={{ width: "25rem", left: "calc(50% - 12rem)" }}
    >
      <h2 style={{ paddingLeft: "1rem" }}>Logowanie</h2>
      <form onSubmit={handleLogin} autoComplete="false">
        <div className={styles["user-input"]}>
          <div className={styles["input-group"]}>
            <UserInput
              id="email"
              name="Email"
              type="email"
              isValid={emailIsValid}
              invalidClass={styles.invalid}
              errorText="Nieprawidłowy e-mail"
              value={loginData.email}
              onChange={handleInputChange}
              onBlur={handleBlur}
              style={{ width: "250px" }}
              maxLength={30}
            />
          </div>
          <div className={styles["input-group"]}>
            <UserInput
              id="password"
              name="Hasło"
              type="password"
              isValid={passwordIsValid}
              invalidClass={styles.invalid}
              errorText="Hasło wymaga przynajmniej 6 znaków"
              value={loginData.password}
              onChange={handleInputChange}
              onBlur={handleBlur}
              style={{ width: "250px" }}
              maxLength={30}
            />
          </div>
        </div>
        {statusContent}
        <div className={styles.actions}>
          <button
            className={styles["button-save"]}
            type="submit"
            disabled={!loginDataIsValid || isLoading}
          >
            Zapisz
          </button>
          <button className={styles["button-close"]} onClick={handleClose}>
            Zamknij
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default LoginForm;
