import Header from "./components/Layout/Header";
import UserInputArea from "./components/UserInputArea/UserInputArea";
import ResultsArea from "./components/Results/ResultsArea";
import Notification from "./components/UI/Notification";
import { useAppSelector } from "./hooks/hooks";
import Footer from "./components/Layout/Footer";
import Actions from "./components/Actions/Actions";

function App() {
  const notification = useAppSelector((state) => state.ui.notification);

  return (
    <div className="layout">
      <Header title="Fundusze rodzinne" />
      {notification && <Notification notification={notification} />}
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
