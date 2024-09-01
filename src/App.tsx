import "./app.css";

import Home from "./Layout/Main";
import { Routes, Route, Navigate } from "react-router-dom";
import { TooltipProvider } from "./components/ui/tooltip";
import { HotkeysProvider } from "react-hotkeys-hook";
import ShortcutLoad from "./lib/Shortcut";
import useInterServerModal from "./store/internalserver";
import ResizeableModel from "./components/ui/ResizeableModel";
import MyComponent from "./components/MyComponent";
import { Toaster } from "./components/ui/sonner";
import useComposerStore from "./store/composer";
import { useProfileStore } from "./store/profile";
import { useEffect, lazy, Suspense } from "react";
import Inputs from "./page/Inputs";

const Login = lazy(() => import("./Auth/Login"))
const Signup = lazy(() => import("./Auth/Signup"))
const MailboxContainer = lazy(() => import("./page/box"))
const LazyCalendar = lazy(() => import("./calendar/Main"));

function App() {
  const { open, toggleModal } = useInterServerModal();
  const NotLogin = !!localStorage.getItem("token");
  const { allowComposer } = useComposerStore();
  const { allSetting } = useProfileStore();

  ShortcutLoad();

  useEffect(() => {
    const root = window.document.body;

    root.classList.remove("light", "dark");

    if (
      !allSetting?.appearance?.theme ||
      allSetting?.appearance?.theme === "system"
    ) {
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
              element={NotLogin ? <Navigate to="/" replace /> :
                <Suspense fallback={"loading..."}>
                  <Login />
                </Suspense>
              }
            />
            <Route
              path="/signup"
              element={NotLogin ? <Navigate to="/" replace /> :
                <Suspense fallback={"loading..."}>
                  <Signup />
                </Suspense>}
            />

            <Route
              path="/"
              element={NotLogin ? <Home /> : <Navigate to="/login" replace />}
            >

              <Route
                path="input"
                element={<Inputs />}
              />

              <Route index element={<Navigate to="/inbox" replace />} />

              <Route
                path=":mailbox"
                element={
                  <Suspense fallback={<div>Loading...</div>}>
                    <MailboxContainer />
                  </Suspense>
                }
              />

              <Route
                path="composer"
                element={allowComposer ? <></> : <Navigate to="/" replace />}
              />
            </Route>


            <Route
              path="/calendar"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <LazyCalendar />
                </Suspense>
              }
            />
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
