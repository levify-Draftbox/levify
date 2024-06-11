import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/ui/resizable"
import SideBar from "./SideBar"

const Home = () => {
    return (
        <ResizablePanelGroup
          direction="horizontal"
          className="min-h-screen max-w-full rounded-lg border"
        >
          <ResizablePanel defaultSize={13}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold"><SideBar/></span>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={87}>
            <div className="flex h-full items-center justify-center p-6">
              <span className="font-semibold">Content</span>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      )
}

export default Home