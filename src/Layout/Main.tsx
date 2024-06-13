import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/ui/resizable"
import SideBar from "../components/SideBar"
import { Outlet } from "react-router-dom"

const Main = () => {
    return (
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-screen max-w-full rounded-lg border"
        >
          <ResizablePanel minSize={10} defaultSize={13}>
            <div className="h-full">
              <SideBar/>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={87}>
            <div className="flex h-full items-center justify-center p-6">
              <Outlet/>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      )
}

export default Main