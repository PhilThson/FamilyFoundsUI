import Header from "./components/Header/Header";
import UserInputArea from "./components/UserInputArea/UserInputArea";
import AddTransactionButton from "./components/AddTransaction/AddTransactionButton";
import ResultsArea from "./components/Results/ResultsArea";

function App() {
  return (
    <>
      <Header />
      <main>
        <UserInputArea />
        <AddTransactionButton />
        <ResultsArea />
      </main>
    </>
  );
}

export default App;
