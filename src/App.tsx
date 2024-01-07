import Header from "./components/Header/Header";
import UserInputArea from "./components/UserInputArea/UserInputArea";
import AddTransactionButton from "./components/AddTransaction/AddTransactionButton";
import ResultsArea from "./components/Results/ResultsArea";
import Notification from "./components/UI/Notification";
import { useSelector } from "react-redux";
import { RootState } from "./store";

function App() {
  const notification = useSelector<RootState>((state) => state.ui.notification);

  return (
    <>
      <Header title="Fundusze rodzinne" />
      {notification && <Notification notification={notification} />}
      <main>
        <UserInputArea />
        <AddTransactionButton />
        <ResultsArea />
      </main>
    </>
  );
}

export default App;
