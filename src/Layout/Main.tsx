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

const Main = () => {
  const mainLayout = useRef<HTMLDivElement>(null)
  const { setParantSize, setAllowComposer } = useComposerStore()
  const { fetchAllProfiles, load } = useProfileStore()

  useEffect(() => {
    setAllowComposer()
    fetchAllProfiles()
    connectWS()

    window.addEventListener("resize", setLayoutSize)
    window.addEventListener("load", setLayoutSize)
    return () => {
      window.removeEventListener("resize", setLayoutSize)
      window.removeEventListener("load", setLayoutSize)
    }
  }, [])
  const setLayoutSize = () => setParantSize(mainLayout.current?.clientWidth || 800)


  return (
    load ?
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
          <div className="w-full h-full bg-background-secondary flex flex-col relative"
            ref={mainLayout}
          >
            <SearchBar />
            <Outlet />
            <Composer />
          </div>
        </ResizablePanel>

      </ResizablePanelGroup>
      :
      <>Loading...</>
  );
};

export default Main;
