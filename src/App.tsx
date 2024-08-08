import { useEffect, useState } from "react";
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
import Editor from "./components/Editer";

function App() {
  const { open, toggleModal } = useInterServerModal();

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, []);

  ShortcutLoad();

  return (
    <HotkeysProvider initiallyActiveScopes={["settings"]}>
      <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
        <TooltipProvider>
          <Routes>
            <Route
              path="/login"
              element={
                isAuthenticated ? <Navigate to="/" replace /> : <Login />
              }
            />
            <Route
              path="/signup"
              element={
                isAuthenticated ? <Navigate to="/" replace /> : <Signup />
              }
            />

            <Route
              path="/"
              element={
                isAuthenticated ? <Home /> : <Navigate to="/login" replace />
              }
            >
              <Route index element={<Inbox />} />
              <Route path="/*" element={<Inbox />} />
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

          <Route path="/login" element={<Editor />} />
        </TooltipProvider>
      </ThemeProvider>
    </HotkeysProvider>
  );
}

export default App;
