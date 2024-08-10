import "./app.css";

import Home from "./Layout/Main";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/Theme-provider";
import Login from "./Auth/Login";
import Inbox from "./page/Inbox";
import { TooltipProvider } from "./components/ui/tooltip";
import { HotkeysProvider } from "react-hotkeys-hook";
import ShortcutLoad from "./lib/Shortcut";
import Signup from "./Auth/Signup";
import useInterServerModal from "./store/internalserver";
import ResizeableModel from "./components/ui/ResizeableModel";
import Inputs from "./page/Inputs";

function App() {
  const { open, toggleModal } = useInterServerModal();
  const NotLogin = !!localStorage.getItem("token");;

  ShortcutLoad();

  return (
    <HotkeysProvider initiallyActiveScopes={["settings"]}>
      <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
        <TooltipProvider>
          <Routes>

            <Route
              path="/login"
              element={
                NotLogin ? <Navigate to="/" replace /> : <Login />
              }
            />
            <Route
              path="/signup"
              element={
                NotLogin ? <Navigate to="/" replace /> : <Signup />
              }
            />

            <Route
            
              path="/"
              element={
                NotLogin ? <Home /> : <Navigate to="/login" replace />
              }
            >
              <Route index element={<Inbox />}  />
              <Route path="input" element={<Inputs />} />
              {/* <Route path="/*" element={<Inbox />} /> */}
            </Route>

          </Routes>

          {open && (
            <ResizeableModel
              onClose={() => toggleModal()}
              key="interservererror"
            >
              Internal server error!
            </ResizeableModel>
          )}

        </TooltipProvider>
      </ThemeProvider>
    </HotkeysProvider>
  );
}

export default App;
