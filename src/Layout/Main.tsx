import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import SideBar from "../components/SideBar";
import { Outlet } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import { useState } from "react";
import Setting from "@/components/Setting";
import useEscKeyStore from "@/store/escStack";
import Modal from "@/components/ui/Modal";

const Main = () => {
  const [viewSetting, setViewSetting] = useState(false);
  const { pushEsc, popEsc } = useEscKeyStore()

  const settingToggle = () => {
    if (viewSetting) {
      setViewSetting(false)
      popEsc()
    } else {
      setViewSetting(true)
      pushEsc("setting-bar", () => setViewSetting(false))
    }
  }

  return (
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
      <ResizablePanel defaultSize={87}>
        <div className="w-full h-full bg-background-secondary">
          <SearchBar onSettingToggle={() => settingToggle()} />
          <Outlet />
          <Modal> 
            <h1>hello</h1>
          </Modal>
        </div>
      </ResizablePanel>
      {viewSetting && (
        <Setting onSettingToggle={() => settingToggle()} />
      )}
    </ResizablePanelGroup>
  );
};

export default Main;
