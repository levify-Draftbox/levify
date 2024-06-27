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
import { useState } from "react";
import { Progress } from "@/components/ui/progress";

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
    <div className="flex flex-col justify-between h-full  p-2 dark:bg-transparent selection:select-none">
      <div className="w-full flex flex-col mt-1">
        <div className="flex w-full px-3 h-10 rounded-md overflow-hidden cursor-pointer">
          <div className="flex items-center justify-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-md">
              <img src={"../../public/image.png"} className="rounded-md" />
            </div>
            <p className="dark:text-[#d5d5d5] max-w-40 text-xl truncate">
              Rellite Mail
            </p>
          </div>
        </div>

        <div className="mt-3">
          <Button size={"superActive"} variant={"superActive"}>
            <p className="text-base">New Mail</p>
          </Button>
        </div>

        <div className="mt-5 flex flex-col gap-1">
          <Button variant={"navlink"} to="/inbox">
            <div className="flex gap-2">
              <Tray size={18} />
              <p className="text-sm">Inbox</p>
            </div>
            <div>
              <div className=" flex justify-center gap-2 items-center">
                <ArrowClockwise
                  size={18}
                  className="hover:rotate-90 transition-all"
                />
                <p className="text-white text-sm px-[6px] bg-purple-700 rounded-sm py-[1px]">
                  1
                </p>
              </div>
            </div>
          </Button>

          <Button variant={"navlink"} to="/Draft">
            <div className="flex gap-2">
              <FileText size={18} />
              <p className="text-sm">Draft</p>
            </div>
            <div>
              <div className=" flex justify-center gap-2 items-center">
                <ArrowClockwise
                  size={18}
                  className="hover:rotate-90 transition-all"
                />
                
              </div>
            </div>
          </Button>

          <Button variant={"navlink"} to="/send">
            <div className="flex gap-2">
              <PaperPlaneRight size={22} />
              <p className="text-sm">Send</p>
            </div>
            <div>
              <div className=" flex justify-center gap-2 items-center">
                <ArrowClockwise
                  size={18}
                  className="hover:rotate-90 transition-all"
                />
                
              </div>
            </div>
          </Button>

          <Button variant={"navlink"} to="/Star">
            <div className="flex gap-2">
              <Star size={22} />
              <p className="text-sm">Star</p>
            </div>
            <div>
              <div className=" flex justify-center gap-2 items-center">
                <ArrowClockwise
                  size={18}
                  className="hover:rotate-90 transition-all"
                />
                
              </div>
            </div>
          </Button>

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
              <Button variant={"navlink"} to="/sendlater">
                <div className="flex gap-2">
                  <CalendarBlank size={18} />
                  <p className="text-sm">Send later</p>
                </div>
                <div>
                  <div className=" flex justify-center gap-2 items-center">
                    <ArrowClockwise
                      size={18}
                      className="hover:rotate-90 transition-all"
                    />
                    
                  </div>
                </div>
              </Button>
              <Button variant={"navlink"} to="/spam">
                <div className="flex gap-2">
                  <WarningOctagon size={18} />
                  <p className="text-sm">Spam</p>
                </div>
                <div>
                  <div className=" flex justify-center gap-2 items-center">
                    <ArrowClockwise
                      size={18}
                      className="hover:rotate-90 transition-all"
                    />
                    
                  </div>
                </div>
              </Button>
              <Button variant={"navlink"} to="/archive">
                <div className="flex gap-2">
                  <Archive size={18} />
                  <p className="text-sm">Archive</p>
                </div>
                <div>
                  <div className=" flex justify-center gap-2 items-center">
                    <ArrowClockwise
                      size={18}
                      className="hover:rotate-90 transition-all"
                    />
                    
                  </div>
                </div>
              </Button>
              <Button variant={"navlink"} to="/trash">
                <div className="flex gap-2">
                  <TrashSimple size={18} />
                  <p className="text-sm">Trash</p>
                </div>
                <div>
                  <div className=" flex justify-center gap-2 items-center">
                    <ArrowClockwise
                      size={18}
                      className="hover:rotate-90 transition-all"
                    />
                    
                  </div>
                </div>
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

export default SideBar;
