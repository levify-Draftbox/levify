import { Button } from "@/components/ui/button";
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
  UserCircle,
} from "@phosphor-icons/react";
import React, { useEffect, useRef, useState } from "react";
import SettingsList from "./list";
import { ModalSidebarLayout } from "@/components/ui/Modal";

type SidebarNavLinkProp = {
  icon: React.ReactNode;
  children: React.ReactNode;
  setting: string;
};

const AllSettings = () => {
  const [activeSetting, setActiveSetting] = useState("profile");
  const scrollChildDivRef = useRef<HTMLDivElement>(null);
  const [childTop, setChildTop] = useState(true);

  const SidebarNavLink = (p: SidebarNavLinkProp) => {
    return (
      <Button
        variant={"navlink"}
        active={activeSetting === p.setting}
        className={"mt-1 !py-0 px-[10px] !h-[30px] font-thin"}
        onClick={() => setActiveSetting(p.setting)}
      >
        <div className="flex gap-2">
          {p.icon}
          <p className="text-sm">{p.children}</p>
        </div>
      </Button>
    );
  };

  const SideBar = () => {
    return (
      <div className="px-2 py-3">
        <div>
          <p className="text-xs px-3 py-1 font-medium text-gray-500 dark:text-gray-400">
            Account
          </p>
          <SidebarNavLink icon={<UserCircle size={18} />} setting={"profile"}>
            Profile
          </SidebarNavLink>
          <SidebarNavLink icon={<BoxArrowUp size={18} />} setting={"plan"}>
            Your Plan
          </SidebarNavLink>
          <SidebarNavLink
            icon={<ChatCenteredText size={18} />}
            setting={"LanguageAndTime"}
          >
            Language and time
          </SidebarNavLink>
        </div>

        <div className="mt-3">
          <p className="text-xs px-3 py-1 font-medium text-gray-500 dark:text-gray-400">
            Mail
          </p>
          <SidebarNavLink
            icon={<PaintRoller size={18} />}
            setting={"appearance"}
          >
            Appearance
          </SidebarNavLink>

          <SidebarNavLink icon={<Bell size={18} />} setting={"notification"}>
            Notification
          </SidebarNavLink>

          <SidebarNavLink icon={<LockKeyOpen size={18} />} setting={"Privacy"}>
            Privacy
          </SidebarNavLink>

          <SidebarNavLink
            icon={<EnvelopeSimple size={18} />}
            setting={"Composer"}
          >
            Composer
          </SidebarNavLink>

          <SidebarNavLink icon={<Funnel size={18} />} setting={"Filter"}>
            Filter And Sweep
          </SidebarNavLink>

          <SidebarNavLink
            icon={<ArrowBendUpLeft size={18} />}
            setting={"AutoReply"}
          >
            Auto Reply
          </SidebarNavLink>

          <SidebarNavLink icon={<ClockUser size={18} />} setting={"Blocking"}>
            Blocking
          </SidebarNavLink>

          <SidebarNavLink
            icon={<ArrowSquareIn size={18} />}
            setting={"importAndExport"}
          >
            Import And Export
          </SidebarNavLink>
          <SidebarNavLink icon={<Globe size={18} />} setting={"domains"}>
            Domains
          </SidebarNavLink>
          <SidebarNavLink icon={<Bell size={18} />} setting={"GetTheApps"}>
            Get The Apps
          </SidebarNavLink>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      setChildTop(target.scrollTop === 0);
    };

    const scrollDiv = scrollChildDivRef.current;
    scrollDiv?.addEventListener("scroll", handleScroll);

    return () => {
      scrollDiv?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    scrollChildDivRef.current?.scrollTo({ top: 0 });
  }, [activeSetting]);

  return (
    <ModalSidebarLayout
      sidebar={<SideBar />}
      sizebarSize={22}
    >
      {SettingsList[activeSetting] ? (
        <div className="h-full flex flex-col">
          <div
            className={`flex flex-col sticky top-0 bg-background-secondary py-5 px-16 gap-1 ${
              !childTop ? "border-b" : ""
            } z-[9]`}
          >
            <h1 className="text-2xl font-[500]">
              {SettingsList[activeSetting].name}
            </h1>
            {SettingsList[activeSetting].description && (
              <div className="text-sm font-thin text-gray-700 dark:text-gray-200">
                {SettingsList[activeSetting].description}
              </div>
            )}
          </div>

          <div
            className="overflow-auto scroll-bar flex-1"
            ref={scrollChildDivRef}
          >
            {SettingsList[activeSetting].component}
          </div>
        </div>
      ) : (
        "not found"
      )}
    </ModalSidebarLayout>
  );
};

export default AllSettings;
