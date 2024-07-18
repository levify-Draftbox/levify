import "./app.css";
import Home from "./Layout/Main";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/Theme-provider";
import Login from "./Auth/Login";
import Inbox from "./page/Inbox";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />}>
          <Route path="/" element={<Inbox />} />
          <Route path="/*" element={<Inbox />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
