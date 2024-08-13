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
import Blocknote from "./components/BlockNote";
import MyComponent from "./components/MyComponent";
import { Toaster } from "./components/ui/toaster";
import useComposerStore from "./store/composer";

function App() {
  const { open, toggleModal } = useInterServerModal();
  const NotLogin = !!localStorage.getItem("token");
  const {allowComposer} = useComposerStore()

  ShortcutLoad();

  return (
    <HotkeysProvider initiallyActiveScopes={["settings"]}>
      <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
        <TooltipProvider>

          <div className="transition-colors">
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
                <Route index element={<Inbox />} />
                <Route path="input" element={<Inputs />} />
                  <Route path="composer" element={
                    allowComposer ? <></> : <Navigate to="/" replace />
                  } />
                <Route path="/*" element={<Inbox />} />
              </Route>

              <Route path="/blocknote" element={<Blocknote />} />
              <Route path="/quill" element={<MyComponent />} />

            </Routes>

            {open && (
              <ResizeableModel
                onClose={() => toggleModal()}
                key="interservererror"
              >
                Internal server error!
              </ResizeableModel>
            )}

          </div>

          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </HotkeysProvider>
  );
}

export default App;
