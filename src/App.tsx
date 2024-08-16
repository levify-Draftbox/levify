import "./app.css";

import Home from "./Layout/Main";
import { Routes, Route, Navigate } from "react-router-dom";
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
import { Toaster } from "./components/ui/sonner";
import useComposerStore from "./store/composer";
import { useSettingsStore } from "./store/SettingStore";
import { useEffect } from "react";

function App() {
  const { open, toggleModal } = useInterServerModal();
  const NotLogin = !!localStorage.getItem("token");
  const {allowComposer} = useComposerStore()
  const {allSetting} = useSettingsStore()


  ShortcutLoad();

  useEffect(() => {
    const root = window.document.body;

    root.classList.remove("light", "dark");

    if (!allSetting?.appearance?.theme || (allSetting?.appearance?.theme === "system")) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(allSetting?.appearance?.theme);
  }, [allSetting?.appearance?.theme]);

  useEffect(() => {
    const root = window.document.body;
    root.classList.remove(
      "purple",
      "red",
      "blue",
      "yellow",
      "green",
      "pink",
      "coral",
      "teal",
      "rust",
      "cerulean",
      "fuchsia",
      "Indigo",
      "Emerald",
      "Rose",
      "Sky",
      "Amber",
      "Violet",
      "Fuchsia",
      "Lime",
      "Cyan"
    );
    root.classList.add(allSetting?.appearance?.color || "purple");
  }, [allSetting?.appearance?.color]);

  return (
    <HotkeysProvider initiallyActiveScopes={["settings"]}>
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
    </HotkeysProvider>
  );
}

export default App;
