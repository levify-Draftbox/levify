import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import SideBar from "../components/SideBar"
import { Outlet } from "react-router-dom"
import SearchBar from "@/components/SearchBar"
import { useState } from "react"

const Main = () => {

  const [viewSetting, setViewSetting] = useState(false)

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="min-h-screen max-w-full rounded-lg border"
    >
      <ResizablePanel minSize={10} maxSize={20} defaultSize={13}>
        <div className="h-full">
          <SideBar />
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={87}>
        <div className="w-full h-full">
          <SearchBar onSettingToggle={() => setViewSetting(!viewSetting)} />
          <Outlet />
        </div>
      </ResizablePanel>
      {
        viewSetting &&
        <>
          <ResizableHandle />
          <ResizablePanel minSize={10} maxSize={20} defaultSize={13}>
            <div className="h-full">
              Hello
            </div>
          </ResizablePanel>
        </>
      }
    </ResizablePanelGroup>
  )
}

export default Main