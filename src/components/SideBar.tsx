import { IoAdd, IoEllipsisHorizontal } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";
import { IoSunnyOutline } from "react-icons/io5";
import { IoMoonOutline } from "react-icons/io5";
import { useTheme } from "./Theme-provider";
import Document from "./Document";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Archive,
  CalendarBlank,
  Export,
  FilePlus,
  Gear,
  MagnifyingGlass,
  PaperPlaneRight,
  TrashSimple,
  Tray,
  WarningOctagon,
} from "@phosphor-icons/react";

const SideBar = () => {
  const { setTheme, theme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);
  const [isSelected, setisSelected] = useState(true);

  const handleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <div className="flex flex-col justify-between h-full text-[#707070] p-2 bg-[#f5f5f5] dark:bg-transparent">
      <div className="w-full flex flex-col mt-1">
        <div className="flex w-full px-3 h-10 rounded-md overflow-hidden hover:bg-[rgba(0,0,0,0.06)] cursor-pointer dark:hover:bg-[rgba(255,255,255,0.2)]">
          <div className="flex items-center justify-center gap-3 flex-shrink-0">
            <div className="w-5 h-5 rounded-sm bg-white"></div>
            <p className="dark:text-[#d5d5d5] max-w-40 truncate">user</p>
          </div>
        </div>

        <Button variant={"compose"} size={"lg"}>
          <Export size={23} />
          <p className="text-base">Compose</p>
        </Button>

        <Button variant={"active"} size={"lg"}>
          <MagnifyingGlass size={23} />
          <p className="text-base">Search</p>
        </Button>

        <Button variant={"active"} size={"lg"}>
          <Gear size={23} />
          <p className="text-base">Setting</p>
        </Button>

        <div>
          <div
            className="flex w-full px-3 py-4 h-10 cursor-pointer rounded-md mt-5"
          >
            <div className="flex items-center justify-center w-full gap-3">
              <div className="flex justify-between w-full">
                <h1 className="text-base text-[#91918e] dark:text-[#a3a3a3]">
                  MAIL
                </h1>
                {isHovered && (
                  <div className="flex items-center gap-1">
                    <IoEllipsisHorizontal
                      title="delete,duplicate and..."
                      size={18}
                    />
                    <IoAdd title="Add page" size={18} />
                  </div>
                )}
              </div>
            </div>
          </div>

          <Button size={"lg"} variant={"Navlink"} to="/inbox">
            <Tray size={23} />
            <p className="text-base">Inbox</p>
          </Button>
          <Button size={"lg"} variant={"Navlink"} to="/send">
            <PaperPlaneRight size={23} />
            <p className="text-base">Send</p>
          </Button>
          <Button size={"lg"} variant={"Navlink"} to="/sendlater">
            <CalendarBlank size={23} />
            <p className="text-base">Send later</p>
          </Button>
          <Button size={"lg"} variant={"Navlink"} to="/spam">
            <WarningOctagon size={23} />
            <p className="text-base">Spam</p>
          </Button>
          <Button size={"lg"} variant={"Navlink"} to="/archive">
            <Archive size={23} />
            <p className="text-base">Archive</p>
          </Button>
          <Button size={"lg"} variant={"Navlink"} to="/trash">
            <TrashSimple size={23} />
            <p className="text-base">Trash</p>
          </Button>
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
                fontSize={23}
                className="text-[#91918e] dark:text-[#a3a3a3]"
              />
            ) : (
              <IoSunnyOutline
                fontSize={23}
                className="text-[#91918e] dark:text-[#a3a3a3]"
              />
            )}
            <h1 className=" dark:text-[#a3a3a3]">
              {theme === "light" ? "Dark" : "Light"}
            </h1>
          </div>
        </div>

        <div className="flex w-full px-3 py-4 h-10 rounded-md hover:bg-[rgba(0,0,0,0.06)] cursor-pointer dark:hover:bg-[rgba(255,255,255,0.2)]">
          <div className="flex items-center justify-center gap-3">
            <IoLogOutOutline
              fontSize={22}
              className="dark:text-[#a3a3a3] text-[#91918e]"
            />
            <h1 className=" dark:text-[#a3a3a3]">Logout</h1>
          </div>
        </div>
        <div className="flex w-full px-3 py-4 h-10 rounded-md hover:bg-[rgba(0,0,0,0.06)] cursor-pointer dark:hover:bg-[rgba(255,255,255,0.2)]">
          <div className="flex items-center justify-center gap-3">
            <IoSettingsOutline
              fontSize={22}
              className="dark:text-[#a3a3a3] text-[#91918e]"
            />
            <h1 className=" dark:text-[#a3a3a3]">Settings</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
