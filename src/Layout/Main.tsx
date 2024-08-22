import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import SideBar from "../components/SideBar";
import { Outlet } from "react-router-dom";
import { useEffect, useRef } from "react";
import Composer from "@/composer";
import useComposerStore from "@/store/composer";
import { useProfileStore } from "@/store/profile";
import SearchBar from "@/components/SearchBar";
import { connectWS } from "@/lib/ws";
import { Spinner } from "@/components/Spinner";

const Main = () => {
  const mainLayout = useRef<HTMLDivElement>(null);
  const { setParantSize, setAllowComposer } = useComposerStore();
  const { fetchAllProfiles, load } = useProfileStore();
  let theme = "dark";

  useEffect(() => {
    if (Notification.permission !== 'granted') Notification.requestPermission()

    setAllowComposer()
    fetchAllProfiles()
    connectWS()

    window.addEventListener("resize", setLayoutSize);
    window.addEventListener("load", setLayoutSize);
    return () => {
      window.removeEventListener("resize", setLayoutSize);
      window.removeEventListener("load", setLayoutSize);
    };
  }, []);
  const setLayoutSize = () =>
    setParantSize(mainLayout.current?.clientWidth || 800);

  return load ? (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-screen max-h-screen max-w-full"
    >
      <ResizablePanel minSize={13} maxSize={20} defaultSize={13}>
        <div className="h-full">
          <SideBar />
        </div>
      </ResizablePanel>

      <ResizableHandle />

      <ResizablePanel defaultSize={87} onResize={setLayoutSize}>
        <div
          className="w-full h-full bg-background-secondary flex flex-col relative"
          ref={mainLayout}
        >
          <SearchBar />
          <Outlet />
          <Composer />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  ) : (
    <div className="w-full h-screen justify-center items-center flex">
      <div className="flex-col items-center">
        <div className="w-64 flex-col items-center">
          <img
            className="w-full"
            alt="DraftBox Mail"
            src={
              theme === "system"
                ? !window.matchMedia("(prefers-color-scheme: dark)").matches
                  ? "/logo-light.svg"
                  : "/logo-dark.svg"
                : theme === "light"
                ? "/logo-light.svg"
                : "/logo-dark.svg"
            }
          />
          <div className="mt-3 w-full flex justify-center">
            <Spinner size={30} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
