import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import { useEffect, useRef } from "react";
import useComposerStore from "@/store/composer";
import { useProfileStore } from "@/store/profile";
import { cn } from "@/lib/utils";

const Main = () => {
  const mainLayout = useRef<HTMLDivElement>(null)
  const { setParantSize, setAllowComposer } = useComposerStore()
  const { fetchAllProfiles } = useProfileStore()



  useEffect(() => {
    setAllowComposer()
    fetchAllProfiles()

    window.addEventListener("resize", setLayoutSize)
    window.addEventListener("load", setLayoutSize)
    return () => {
      window.removeEventListener("resize", setLayoutSize)
      window.removeEventListener("load", setLayoutSize)
    }
  }, [])
  const setLayoutSize = () => setParantSize(mainLayout.current?.clientWidth || 800)

  return (
    <div className="w-full h-screen p-1">


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

        <ResizableHandle className="bg-transparent" />

        <ResizablePanel defaultSize={87} onResize={setLayoutSize}>
          <div
            className="w-full h-full bg-background flex flex-col relative"
            ref={mainLayout}
          >
            <SearchBar />

            <div className="border-l border-t border-border !rounded-tl-lg overflow-hidden flex-1 overflow bg-background-secondary">
              <Outlet />
            </div>

          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Main;
