import { IoSettingsOutline } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";
import { IoSunnyOutline } from "react-icons/io5";
import { IoMoonOutline } from "react-icons/io5";
import { useTheme } from "./Theme-provider";
import { Button } from "./ui/button";
import {
  Archive,
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
import { useState } from "react";

const SideBar = () => {
  const { setTheme, theme } = useTheme();
  const [moreLess, setmoreLess] = useState(false);

  const handleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <div className="flex flex-col justify-between h-full text-[#707070] p-2 bg-[#f5f5f5] dark:bg-transparent selection:select-none">
      <div className="w-full flex flex-col mt-1">
        <div className="flex w-full px-3 h-10 rounded-md overflow-hidden hover:bg-[rgba(0,0,0,0.06)] cursor-pointer dark:hover:bg-[rgba(255,255,255,0.2)]">
          <div className="flex items-center justify-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 rounded-sm bg-[#7c5cff]"></div>
            <p className="dark:text-[#d5d5d5] max-w-40 text-xl truncate">
              Rellite Mail
            </p>
          </div>
        </div>

        <div className="mt-5">
          <Button variant={"superActive"} size={"lg"}>
            <p className="text-base">New Mail</p>
          </Button>
        </div>

        <div className="mt-5 flex flex-col gap-1">
          <Button size={"lg"} variant={"Navlink"} to="/inbox">
            <Tray size={23} />
            <p className="text-sm">Inbox</p>
          </Button>

          <Button size={"lg"} variant={"Navlink"} to="/Draft">
            <FileText size={23} />
            <p className="text-sm">Draft</p>
          </Button>

          <Button size={"lg"} variant={"Navlink"} to="/send">
            <PaperPlaneRight size={22} />
            <p className="text-sm">Send</p>
          </Button>

          <Button size={"lg"} variant={"Navlink"} to="/Star">
            <Star size={22} />
            <p className="text-sm">Star</p>
          </Button>

          <div
            onClick={() => {
              setmoreLess(!moreLess);
            }}
            className="py-2 px-3 w-full rounded-lg hover:bg-[rgba(0,0,0,0.07)]"
          >
            {moreLess ? (
              <div className="flex items-center gap-2">
                <CaretRight size={10} />
                <p className="text-sm">Less</p>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CaretDown size={10} />
                <p className="text-sm">More</p>
              </div>
            )}
          </div>

          {moreLess && (
            <div>
              <Button size={"lg"} variant={"Navlink"} to="/sendlater">
                <CalendarBlank size={22} />
                <p className="text-sm">Send later</p>
              </Button>
              <Button size={"lg"} variant={"Navlink"} to="/spam">
                <WarningOctagon size={22} />
                <p className="text-sm">Spam</p>
              </Button>
              <Button size={"lg"} variant={"Navlink"} to="/archive">
                <Archive size={22} />
                <p className="text-sm">Archive</p>
              </Button>
              <Button size={"lg"} variant={"Navlink"} to="/trash">
                <TrashSimple size={22} />
                <p className="text-sm">Trash</p>
              </Button>
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
