import { Button } from "@/components/ui/button";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import {
  ArrowBendUpLeft,
  ArrowSquareIn,
  Bell,
  BoxArrowUp,
  ChatCenteredText,
  ClockUser,
  EnvelopeSimple,
  Funnel,
  Globe,
  LockKeyOpen,
  PaintRoller,
  SquaresFour,
} from "@phosphor-icons/react";
// import { Key, User, Globe, PaintRoller, Shield } from "lucide-react"
import React, { useState } from "react";
import SettingsList from "./list";

type SidebarNavLinkProp = {
  icon: React.ReactNode;
  children: React.ReactNode;
  setting: string;
};

const AllSettings = () => {
  const [activeSetting, setActiveSetting] = useState("dashboard");

  const SidebarNavLink = (p: SidebarNavLinkProp) => {
    return (
      <Button
        variant={"navlink"}
        active={activeSetting == p.setting}
        className={"mt-1"}
        onClick={() => setActiveSetting(p.setting)}
      >
        <div className="flex gap-2">
          {p.icon}
          <p className="text-sm">{p.children}</p>
        </div>
      </Button>
    );
  };

  return (
    <ResizablePanelGroup
      className="min-h-full max-w-full rounded-lg mt-2"
      direction="horizontal"
    >
      <ResizablePanel
        minSize={14}
        maxSize={20}
        defaultSize={14}
        className="pr-4 min-h-[700px]"
      >
        <div>
          <div className="mt-3">
            <p className="text-sm">Account</p>
            <SidebarNavLink
              icon={<SquaresFour size={18} />}
              setting={"dashboard"}
            >
              Dashbord
            </SidebarNavLink>
            <SidebarNavLink icon={<BoxArrowUp size={18} />} setting={"plan"}>
              Your Plan
            </SidebarNavLink>
            <SidebarNavLink
              icon={<ChatCenteredText size={18} />}
              setting={"security"}
            >
              Language and time
            </SidebarNavLink>
          </div>

          <div className="mt-3">
            <p className="text-sm">Mail</p>
            <SidebarNavLink
              icon={<PaintRoller size={18} />}
              setting={"appearance"}
            >
              Appearance
            </SidebarNavLink>

            <SidebarNavLink icon={<Bell size={18} />} setting={"appearance"}>
              Notification
            </SidebarNavLink>

            <SidebarNavLink
              icon={<LockKeyOpen size={18} />}
              setting={"appearance"}
            >
              Privacy
            </SidebarNavLink>

            <SidebarNavLink
              icon={<EnvelopeSimple  size={18} />}
              setting={"appearance"}
            >
              Compose
            </SidebarNavLink>

            <SidebarNavLink icon={<Funnel size={18} />} setting={"appearance"}>
              Filter And Sweep
            </SidebarNavLink>

            <SidebarNavLink
              icon={<ArrowBendUpLeft size={18} />}
              setting={"appearance"}
            >
              Auto Reply
            </SidebarNavLink>

            <SidebarNavLink
              icon={<ClockUser size={18} />}
              setting={"appearance"}
            >
              Blocking
            </SidebarNavLink>

            <SidebarNavLink
              icon={<ArrowSquareIn size={18} />}
              setting={"appearance"}
            >
              import And Export
            </SidebarNavLink>
            <SidebarNavLink
              icon={<Globe  size={18} />}
              setting={"appearance"}
            >
              domains
            </SidebarNavLink>
            <SidebarNavLink icon={<Bell size={18} />} setting={"appearance"}>
            Get The Apps
            </SidebarNavLink>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <div className="pl-4">
          {SettingsList[activeSetting] ? (
            <>
              <h1 className="text-2xl font-[500] mb-2">
                {SettingsList[activeSetting].name}
              </h1>

              {SettingsList[activeSetting].component}
            </>
          ) : (
            "not found"
          )}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default AllSettings;
