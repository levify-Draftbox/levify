import { Button } from "./ui/button";
import {
  Archive,
  CalendarBlank,
  CaretDown,
  CaretRight,
  FileText,
  Gear,
  PaperPlaneRight,
  Star,
  TrashSimple,
  Tray,
  WarningOctagon,
} from "@phosphor-icons/react";
import React, { lazy, Suspense, useState } from "react";
import { Progress } from "@/components/ui/progress";

import { Link } from "react-router-dom";
import ScrollArea from "./ui/ScrollArea";
import useComposerStore from "@/store/composer";
import { useProfileStore } from "@/store/profile";
import Modal from "./ui/Modal";
import { Spinner } from "./Spinner";
const AllSettings = lazy(() => import("@/AllSettings"));

const SideBar = () => {
  const { allSetting } = useProfileStore();
  const [moreLess, setmoreLess] = useState(false);

  const { newComposer } = useComposerStore()
  const [settingOpen, setSettingOpen] = useState(false)

  return (
    <div className="flex flex-col justify-between h-full dark:bg-transparent selection:select-none">
      <div className="p-2">
        <div className="w-full flex flex-col mt-1">
          <Link to="/inbox" className="cursor-pointer my-1 mx-2">
            <img className="w-full" alt="DraftBox Mail" src={
              allSetting?.appearance?.theme === "system" ?
                !window.matchMedia("(prefers-color-scheme: dark)")
                  .matches
                  ? "/logo-light.svg" : "/logo-dark.svg"
                :
                allSetting?.appearance?.theme === "light" ? "/logo-light.svg" : "/logo-dark.svg"
            } />
          </Link>

          <div className="mt-3">
            <Button onClick={() => newComposer()} variant={"primary"} size={"sm"}>
              New Message
            </Button>
          </div>

        </div>
      </div>

      <div className="flex-1 overflow-hidden py-2">
        <ScrollArea border className="flex flex-col gap-1 scroll-hide px-2">
          <SidebarNavLink
            icon={<Tray size={18} />}
            unread={4}
            to="/inbox"
          >Inbox</SidebarNavLink>

          <SidebarNavLink
            icon={<FileText size={18} />}
            to="/inbox/draft"
          >Draft</SidebarNavLink>

          <SidebarNavLink
            icon={<PaperPlaneRight size={18} />}
            unread={12}
            to="/inbox/sent"
          >Sent</SidebarNavLink>

          <SidebarNavLink
            icon={<Star size={18} />}
            to="/inbox/star"
          >Starred</SidebarNavLink>

          <div
            onClick={() => {
              setmoreLess(!moreLess);
            }}
            className="py-2 px-3 w-full rounded-lg hover:bg-[rgba(0,0,0,0.07)]"
          >
            {moreLess ? (
              <div className="flex items-center gap-2">
                <CaretDown size={10} />

                <p className="text-sm">Less</p>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CaretRight size={10} />

                <p className="text-sm">More</p>
              </div>
            )}
          </div>
          {
            [0, 0, 0, 0, 0, 0].map(_ =>
              moreLess && (
                <div className="flex flex-col gap-1">

                  <SidebarNavLink
                    icon={<CalendarBlank size={18} />}
                    to="/inbox/later"
                  >Send later</SidebarNavLink>

                  <SidebarNavLink
                    icon={<WarningOctagon size={18} />}
                    unread={3}
                    to="/inbox/spam"
                  >Spam</SidebarNavLink>

                  <SidebarNavLink
                    icon={<Archive size={18} />}
                    to="/inbox/archive"
                  >Archive</SidebarNavLink>

                  <SidebarNavLink
                    icon={<TrashSimple size={18} />}
                    to="/inbox/trash"
                  >Trash</SidebarNavLink>

                </div>
              ))
          }
        </ScrollArea>
      </div>

      <div className="w-full flex flex-col p-1 pb-4">
        <Button
          variant={"secondary"}
          onClick={() => setSettingOpen(true)}
          className="w-full"
        >
          <Gear />
          Setting
        </Button>
        <div className="w-full pt-3 px-1">
          <Progress value={10} />
          <div className="text-xs flex justify-between  mt-2">
            <div className="flex">
              <span className="font-semibold">200 MB </span>
              <p>/ 2.0 GB</p>
            </div>
            <p>1.0.0</p>
          </div>
        </div>
      </div>

      {settingOpen && (
        <Modal width={"58%"} key="full-settings" modalKey="full-settings" onClose={() => setSettingOpen(false)}>
          <Suspense fallback={
            <div className="flex items-center justify-center h-full w-full">
              <Spinner size={50} borderWidth={4} />
            </div>
          }>
            <AllSettings />
          </Suspense>
        </Modal>
      )}

    </div>
  );
};

type SidebarNavLinkProp = {
  icon: React.ReactNode
  children: React.ReactNode
  to?: string
  unread?: number
}
function SidebarNavLink(p: SidebarNavLinkProp) {
  return (
    <Button variant={"navlink"} to={p.to || "/"}>
      <div className="flex gap-2">
        {p.icon}
        <p className="text-sm">{p.children}</p>
      </div>
      <div>
        <div className=" flex justify-center gap-2 items-center">
         
          {
            p.unread && p.unread > 0 &&
            <p className="text-white text-sm px-[10px] bg-core rounded-full py-[1px] !font-bold">
              {p.unread}
            </p>
          }
        </div>
      </div>
    </Button>
  )
}

export default SideBar;
