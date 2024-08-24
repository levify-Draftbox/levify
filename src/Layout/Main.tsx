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
import { cn } from "@/lib/utils";
import { motion } from "framer-motion"
import useloadInboxModal from "@/store/loadinbox";

const Main = () => {
  const mainLayout = useRef<HTMLDivElement>(null);
  const { setParantSize, setAllowComposer } = useComposerStore();
  const { fetchAllProfiles, load: loadSettings } = useProfileStore();
  const { load: inboxLoad } = useloadInboxModal()
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

  return (
    <>
      {!(loadSettings && inboxLoad) &&
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
      }
      {loadSettings &&
        <div className="!h-screen overflow-hidden">
          <motion.div className={cn(
            "h-full",
            { "p-1": true }
          )}
            initial={{
              opacity: .0,
              scale: .95
            }}
            animate={inboxLoad ? {
              opacity: 1,
              scale: 1
            } : {}}
            transition={{
              ease: "easeIn",
              duration: .25
            }}
          >
            <ResizablePanelGroup
              direction="horizontal"
              className={cn(
                "w-full h-full overflow-hidden",
                {
                  "border border-border rounded-md": true
                }
              )}
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
          </motion.div>
        </div>
      }
    </>
  )
};

export default Main;
