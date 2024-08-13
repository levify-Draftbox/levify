import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import SideBar from "../components/SideBar";
import { Outlet } from "react-router-dom";
import SearchBar from "@/components/SearchBar";
import { useEffect, useRef, useState } from "react";
import Setting from "@/components/Setting";
import useEscKeyStore from "@/store/escStack";
import Composer from "@/components/composer";
import useComposerStore from "@/store/composer";
import { useSettingsStore } from "@/store/SettingStore";

const Main = () => {
  const [viewSetting, setViewSetting] = useState(false);
  const { pushEsc, popEsc } = useEscKeyStore()
  const mainLayout = useRef<HTMLDivElement>(null)
  const { setParantSize, setAllowComposer } = useComposerStore()
  const { fetchAllSettings } = useSettingsStore()

  const settingToggle = () => {
    if (viewSetting) {
      setViewSetting(false)
      popEsc()
    } else {
      setViewSetting(true)
      pushEsc("setting-bar", () => setViewSetting(false))
    }
  }

  useEffect(() => {
    setAllowComposer()
    fetchAllSettings()

    window.addEventListener("resize", setLayoutSize)
    window.addEventListener("load", setLayoutSize)
    return () => {
      window.removeEventListener("resize", setLayoutSize)
      window.removeEventListener("load", setLayoutSize)
    }
  }, [])
  const setLayoutSize = () => setParantSize(mainLayout.current?.clientWidth || 800)

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

      <ResizablePanel defaultSize={87} onResize={setLayoutSize}>
        <div className="w-full h-full bg-background-secondary flex flex-col relative"
          ref={mainLayout}
        >
          <SearchBar onSettingToggle={() => settingToggle()} />
          <Outlet />
          <Composer />
        </div>

      </ResizablePanel>

      {viewSetting && (
        <Setting onSettingToggle={() => settingToggle()} />
      )}
    </ResizablePanelGroup>
  );
};

export default Main;
