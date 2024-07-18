import { IoSunnyOutline } from "react-icons/io5";
import { IoMoonOutline } from "react-icons/io5";
import { useTheme } from "./Theme-provider";
import { Button } from "./ui/button";
import {
  Archive,
  ArrowClockwise,
  CalendarBlank,
  CaretDown,
  CaretRight,
  FileText,
  PaperPlaneRight,
  Star,
  TrashSimple,
  Tray,
  WarningOctagon,
} from "@phosphor-icons/react";
import React, { useState } from "react";
import { Progress } from "@/components/ui/progress";

import { Link } from "react-router-dom";

const SideBar = () => {
  const { setTheme, theme } = useTheme();
  const [moreLess, setmoreLess] = useState(false);

  const handleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <div className="flex flex-col justify-between h-full  p-2 dark:bg-transparent selection:select-none">
      <div className="w-full flex flex-col mt-1">
        <Link to="/inbox" className="cursor-pointer my-1 mx-2">
          <img className="w-full" alt="DraftBox Mail" src={theme === "light" ? "  /logo-light.svg" : "/logo-dark.svg"} />
        </Link>

        <div className="mt-3">
          <Button size={"superActive"} variant={"superActive"}>
            New Mail
          </Button>
        </div>

        <div className="mt-5 flex flex-col gap-1">

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

          {moreLess && (
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
          )}
        </div>
      </div>

      <div className="w-full flex flex-col mb-2">
        <div
          onClick={handleTheme}
          className="flex w-full px-3 py-4 h-10 rounded-md cursor-pointer hover:bg-[rgba(0,0,0,0.06)] dark:hover:bg-[rgba(255,255,255,0.2)]"
        >
          <div className="flex items-center justify-center gap-3">
            {theme === "light" ? (
              <IoMoonOutline
                fontSize={18}
                className="text-[#91918e] dark:text-[#a3a3a3]"
              />
            ) : (
              <IoSunnyOutline
                fontSize={18}
                className="text-[#91918e] dark:text-[#a3a3a3]"
              />
            )}
            <h1 className=" dark:text-[#a3a3a3]">
              {theme === "light" ? "Dark" : "Light"}
            </h1>
          </div>
        </div>

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
          <ArrowClockwise
            size={16}
            className="hover:rotate-90 transition-all hidden group-[.is-active]:block"
          />
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
