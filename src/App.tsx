import "./app.css";
import Home from "./Layout/Main";
import { Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/Theme-provider";
import Login from "./Auth/Login";
import Inbox from "./page/Inbox";
import { TooltipProvider } from "./components/ui/tooltip";
import { HotkeysProvider } from "react-hotkeys-hook";
import ShortcutLoad from "./lib/Shortcut";
import Singup from "./Auth/Singup";

function App() {
  ShortcutLoad();

  return (
    <HotkeysProvider initiallyActiveScopes={["settings"]}>
      <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
        <TooltipProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/singup" element={<Singup />} />

            <Route path="/" element={<Home />}>
              <Route path="/" element={<Inbox />} />
              <Route path="/*" element={<Inbox />} />
            </Route>
          </Routes>
        </TooltipProvider>
      </ThemeProvider>
    </HotkeysProvider>
  );
}

export default App;
