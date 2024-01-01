import Header from "./components/Header";
import UserInputArea from "./components/UserInputArea/UserInputArea";
import ResultsArea from "./components/Results/ResultsArea";

function App() {
  return (
    <>
      <Header />
      <main>
        <UserInputArea />
        <ResultsArea />
      </main>
    </>
  );
}

export default App;
