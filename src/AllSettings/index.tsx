import { Button } from "@/components/ui/button"
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable"
import { SquaresFour } from "@phosphor-icons/react"
// import { Key, User, Globe, PaintRoller, Shield } from "lucide-react"
import React, { useState } from "react"
import SettingsList from "./list"

type SidebarNavLinkProp = {
    icon: React.ReactNode;
    children: React.ReactNode;
    setting: string;
};

const AllSettings = () => {

    const [activeSetting, setActiveSetting] = useState("dashboard")

    const SidebarNavLink = (p: SidebarNavLinkProp) => {
        return (
            <Button variant={"navlink"} active={activeSetting == p.setting} className={"mt-2"} onClick={() => setActiveSetting(p.setting)}>
                <div className="flex gap-2">
                    {p.icon}
                    <p className="text-sm">{p.children}</p>
                </div>
            </Button>
        );
    }

    return (
        <ResizablePanelGroup
            className="min-h-full max-w-full rounded-lg mt-2"
            direction="horizontal"
        >
            <ResizablePanel minSize={14} maxSize={20} defaultSize={14} className="pr-4 min-h-[700px]">
                <div>
                    <div className="mt-3">
                        <p className="text-sm">Account</p>
                        <SidebarNavLink
                            icon={<SquaresFour size={18} />}
                            setting={"dashboard"}
                        >
                            Dashbord
                        </SidebarNavLink>
                        <SidebarNavLink
                            icon={<SquaresFour size={18} />}
                            setting={"plan"}
                        >
                            Your Plan
                        </SidebarNavLink>
                        <SidebarNavLink
                            icon={<SquaresFour size={18} />}
                            setting={"security"}
                        >
                            Security
                        </SidebarNavLink>
                        <SidebarNavLink
                            icon={<SquaresFour size={18} />}
                            setting={"appearance"}
                        >
                            Appearance
                        </SidebarNavLink>
                    </div>

                </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel>
                <div className="pl-4">
                    {
                        SettingsList[activeSetting] ? <>

                            <h1 className="text-2xl font-[500] mb-2">{SettingsList[activeSetting].name}</h1>

                            {SettingsList[activeSetting].component}

                        </> : "not found"
                    }
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}

export default AllSettings