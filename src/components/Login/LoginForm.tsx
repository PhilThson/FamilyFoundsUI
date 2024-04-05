import Modal from "../UI/Modal";
import UserInput from "../UserInputArea/UserInput";
import { IActionState, IAuthenticateRequest } from "../../models/Main";
import { ChangeEvent, useState } from "react";
import { useAppDispatch } from "../../hooks/hooks";
import sha256 from "crypto-js/sha256";
import { useLoginMutation } from "../../store/auth-slice";
import { authSliceActions } from "../../store/auth-slice";

import styles from "./LoginForm.module.css";
import Spinner from "../UI/Spinner";

const initLoginData = {
  email: "",
  password: "",
};
const emailRegex = new RegExp("^[^@]+@[^@]+.[^@]+$");

const LoginForm: React.FC<{
  onClose: () => void;
  loginState: IActionState;
}> = ({ onClose, loginState }) => {
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
    switch (id) {
      case "email":
        setEmailIsValid(emailRegex.test(value));
        break;
      case "password":
        setPasswordIsValid(value.length >= 6);
        break;
      default:
        break;
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
    statusContent = <p className="error-text">{error?.toString()}</p>;
  }
  // switch (loginState.status) {
  //   case "pending":
  //     statusContent = <Spinner text="Logowanie..." />;
  //     break;
  //   case "error":
  //     statusContent = <p className="error-text">{loginState.error}</p>;
  //     break;
  //   default:
  //     break;
  // }

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
    //dispatch(login(authRequest));
    try {
      const response = await logIn(authRequest).unwrap();
      dispatch(authSliceActions.updateLoginState(response));
    } catch (err) {}
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
            disabled={!loginDataIsValid || isLoading} //loginState.status === "pending"}
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
