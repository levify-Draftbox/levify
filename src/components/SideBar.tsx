import { Button } from "./ui/button";
import {
  CaretDown,
  CaretRight,
  FileText,
  Gear,
  PaperPlaneRight,
  Star,
  Tray,
} from "@phosphor-icons/react";
import React, { lazy, Suspense, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

import { Link } from "react-router-dom";
import ScrollArea from "./ui/ScrollArea";
import useComposerStore from "@/store/composer";
import { useProfileStore } from "@/store/profile";
import Modal from "./ui/Modal";
import { Spinner } from "./Spinner";
import useListState from "@/store/listState";
const AllSettings = lazy(() => import("@/AllSettings"));

type SidebarList = { id: number, icon: React.ReactNode, label: string, path: string }

const SideBar = () => {
  const { allSetting } = useProfileStore();
  const [moreLess, setmoreLess] = useState(false);

  const { newComposer } = useComposerStore();
  const [settingOpen, setSettingOpen] = useState(false);

  const [sidebarItems, setSidebarItems] = useState<SidebarList[]>([
    { id: 1, icon: <Tray size={18} />, label: "Inbox", path: "inbox" },
    { id: 2, icon: <FileText size={18} />, label: "Draft", path: "draft" },
    { id: 3, icon: <PaperPlaneRight size={18} />, label: "Sent", path: "sent" },
    { id: 4, icon: <Star size={18} />, label: "Starred", path: "star" },
  ]);

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
    const newItems = [...sidebarItems];
    const [reorderedItem] = newItems.splice(dragIndex, 1);
    newItems.splice(dropIndex, 0, reorderedItem);
    setSidebarItems(newItems);

    // Log the new order to the console
    console.log("New sidebar order:", newItems.map(item => ({ id: item.id, label: item.label })));
  };

  return (
    <div className="flex flex-col justify-between h-full dark:bg-transparent selection:select-none">
      <div className="p-2">
        <div className="w-full flex flex-col mt-1">
          <Link to="/inbox" className="cursor-pointer mx-2">
            <img
              className="max-h-[28px]"
              alt="DraftBox Mail"
              src={
                allSetting?.appearance?.theme === "system"
                  ? !window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "/logo-light.svg"
                    : "/logo-dark.svg"
                  : allSetting?.appearance?.theme === "light"
                    ? "/logo-light.svg"
                    : "/logo-dark.svg"
              }
            />
          </Link>

          <div className="mt-3">
            <Button
              onClick={() => newComposer()}
              variant={"primary"}
              size={"sm"}
            >
              New Message
            </Button>

          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden py-2">
        <ScrollArea border className="flex flex-col gap-1 scroll-hide px-2">
          {sidebarItems.map((item, index) => (
            <motion.div
              key={item.id}
              draggable
              onDragStart={(e) => {
                // @ts-ignore
                handleDragStart(e, index)
              }}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              animate={{
                scale: draggedIndex === index ? 1.05 : 1,
                opacity: draggedIndex === index ? 0.8 : 1,
              }}
              transition={{ duration: 0.2 }}
              className={`cursor-move ${draggedIndex === index ? 'shadow-lg' : ''}`}
            >
              <SidebarNavLink {...item}>
                {item.label}
              </SidebarNavLink>
            </motion.div>
          ))}
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
        <Modal
          width={"58%"}
          key="full-settings"
          modalKey="full-settings"
          onClose={() => setSettingOpen(false)}
        >
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-full w-full">
                <Spinner size={50} borderWidth={4} />
              </div>
            }
          >
            <AllSettings />
          </Suspense>
        </Modal>
      )}
    </div>
  );
};

function SidebarNavLink(p: SidebarList) {
  const { unreadCount } = useListState()
  const unreadMsg = unreadCount[p.path]

  return (
    <Button variant={"navlink"} to={`/${p.path}` || "/"}>
      <div className="flex gap-2">
        {p.icon}
        <p className="text-sm">{p.label}</p>
      </div>
      <div>
        <div className=" flex justify-center gap-2 items-center">
          {(unreadMsg && unreadMsg != 0) ? (
            <p className="text-white text-sm px-[10px] bg-core rounded-full py-[1px] !font-bold">
              {unreadMsg}
            </p>) : <></>}
        </div>
      </div>
    </Button>
  );
}

export default SideBar;
