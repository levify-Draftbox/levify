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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  ShortcutLoad();

  return (
    <HotkeysProvider initiallyActiveScopes={["settings"]}>
      <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
        <TooltipProvider>
          <Routes>
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
            <Route path="/signup" element={isAuthenticated ? <Navigate to="/" replace /> : <Signup />} />
            
            <Route 
              path="/" 
              element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />}
            >
              <Route index element={<Inbox />} />
              <Route path="/*" element={<Inbox />} />
            </Route>
          </Routes>
        </TooltipProvider>
      </ThemeProvider>
    </HotkeysProvider>
  );
}

export default App;