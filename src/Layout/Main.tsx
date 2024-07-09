import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import SideBar from "../components/SideBar";
import { Outlet } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import { useState } from "react";
import { X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

const Main = () => {
  const [viewSetting, setViewSetting] = useState(false);

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
      {viewSetting && (
        <>
          <ResizableHandle />
          <ResizablePanel minSize={10} maxSize={20} defaultSize={13}>
            <div className="p-3 flex justify-between">
              <h1 className="my-auto">Settings</h1>
              <Button variant={"toolbutton"} size={"toolsize"} className="h-8" onClick={()=> setViewSetting(!viewSetting)}> 
                <X size={20} />
              </Button>
            </div>
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  );
};

export default Main;
