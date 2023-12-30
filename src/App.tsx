import Header from "./components/Header";
import UserInputArea from "./components/UserInputArea/UserInputArea";
import Transactions from "./components/Transactions";

function App() {
  return (
    <>
      <Header />
      <main>
        <UserInputArea />
        <Transactions />
      </main>
    </>
  );
}

export default App;
