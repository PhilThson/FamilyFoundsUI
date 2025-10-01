import Header from "./components/Layout/Header";
import UserInputArea from "./components/UserInputArea/UserInputArea";
import Notification from "./components/UI/Notification";
import { useAppDispatch, useAppSelector } from "./hooks/hooks";
import Footer from "./components/Layout/Footer";
import Actions from "./components/Actions/Actions";
import ResultsArea from "./components/Results/ResultsArea";
import LoginButton from "./components/Login/LoginButton";
import { useEffect } from "react";
import { scheduleTokenRefresh } from "./utils/api/refresh-token";

function App() {
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const notification = useAppSelector((state) => state.ui.notification);

  useEffect(() => {
    if (accessToken) {
      scheduleTokenRefresh(accessToken, dispatch);
    }
  }, [accessToken, dispatch]);

  return (
    <div className="layout">
      <LoginButton />
      <Header title="Fundusze rodzinne" />
      {notification && <Notification {...notification} />}
      <main>
        <Actions />
        <UserInputArea />
        <ResultsArea />
      </main>
      <Footer />
    </div>
  );
}

export default App;
