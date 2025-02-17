import CreateSeedPhrase from "./components/CreateSeedPhrase";
import Navbar from "./components/Navbar";
import { useState } from "react";
import "./App.css";

function App() {
  const [darkTheme, setDarkTheme] = useState(false);
  return (
    <>
      <Navbar darkTheme={darkTheme} setDarkTheme={setDarkTheme} />
      <CreateSeedPhrase darkTheme={darkTheme} setDarkTheme={setDarkTheme} />
    </>
  );
}

export default App;
