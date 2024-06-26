import "./app.css";
import Home from "./Layout/Main";
import { Routes, Route } from "react-router-dom";
import Page from "./Backup/Page";
import { ThemeProvider } from "./components/Theme-provider";
import Login from "./Auth/Login";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />}>
          <Route path="/" element={<h1>Hello Page</h1>} />
          <Route path="/*" element={<Page />} />
          <Route path="/page2" element={<Page />} />
          <Route path="/page3" element={<Page />} />
          <Route path="/page4" element={<Page />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
