// deprecated

import { Button } from "./ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, Suspense, useState } from "react";
import { Progress } from "@/components/ui/progress";
import Modal from "@/components/ui/Modal";
import { ChevronRight } from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
} from "./ui/resizable";
import { ThemeColors } from
 "./Theme";
import ScrollArea from "./ui/ScrollArea";
import Kbd from "./ui/kbd";
import { SignOut } from "@phosphor-icons/react";
import { Switch } from "./ui/switch";

type SearchBarProp = {
  onSettingToggle: () => void;
};

const Setting = ({ onSettingToggle }: SearchBarProp) => {
  return (
    <>
      <ResizableHandle />
      <ResizablePanel defaultSize={20} minSize={16} maxSize={22}>
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ stiffness: 200, duration: 0.25 }}
          className="!h-[100vh] overflow-auto select-none bg-background-secondary"
        >
          <div className="h-[100vh] flex flex-col">
            <div className={`h-[51px] flex justify-between sticky top-0 px-3 z-[9999] bg-background-secondary`} >
              <h1 className="my-auto">Settings</h1>
              <Button
                variant={"toolbutton"}
                size={"toolsize"}
                className="my-auto"
                onClick={() => onSettingToggle()}
              >
                <ChevronRight size={20} />
              </Button>
            </div>
            <div className="overflow-hidden flex-1">
              <ScrollArea border className="px-3 py-2">
                <AnimatePresence>
                  <SettingSidebar />
                </AnimatePresence>
              </ScrollArea>
            </div>
          </div>
        </motion.div>
      </ResizablePanel>
    </>
  );
};

const SettingSidebar = () => {

  const [toggleLayout, setToggleLayout] = useState(false);
  const [toggleDensity, setToggleDensity] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAppModalOpen, setisAppModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const handleButtonClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleAppModel = () => {
    setisAppModalOpen(!isAppModalOpen);
  };

  const handleImageClick = (index: number) => {
    setSelectedImage(index);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');

    window.location.href = "/";
  };


  let theme = ""
  let themeColor = ""
  const setTheme = (_: string) => { }
  const setColorTheme = (_: string) => { }

  return (
    <div className="flex flex-col gap-3 py-2">
      <Button
        onClick={handleButtonClick}
        variant="primary"
        className=""
      >
        All Settings
      </Button>
      <Button onClick={handleAppModel} variant={"secondary"} className="">
        Get the Rellite Mail app
      </Button>

      <Card hedding={"Your plan"}>
        <div className="w-full pt-1 px-1">
          <Progress value={10} />
          <div className="text-xs flex justify-between mt-2">
            <div className="flex">
              <span className="font-semibold">200 MB </span>
              <p>/ 2.0 GB</p>
            </div>
          </div>
        </div>
        <Button variant={"primary"} className="capitalize">
          Upgrade your plan
        </Button>
      </Card>

      <Card hedding={"Personalization"}>
        <div
          className="flex justify-between cursor-pointer"
          onClick={() => setToggleLayout(!toggleLayout)}
        >
          <p>Layout</p>
          <p className="text-core text-sm capitalize">row</p>
        </div>

        {toggleLayout && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ease: "easeInOut" }}
            className="flex gap-4"
          >
            <img
              src="./download (1).jpg"
              style={{
                width: "calc((100% - 1rem) / 2)",
              }}
              className={`h-auto object-cover rounded-md ${selectedImage === 1 ? "ring-2 ring-core" : ""
                }`}
              onClick={() => handleImageClick(1)}
              alt="Image 1"
            />
            <img
              src="./download.jpg"
              style={{
                width: "calc((100% - 1rem) / 2)",
              }}
              className={`h-auto object-cover rounded-md ${selectedImage === 2 ? "ring-2 ring-core" : ""
                }`}
              onClick={() => handleImageClick(2)}
              alt="Image 2"
            />
          </motion.div>
        )}

        <div
          className="flex justify-between cursor-pointer"
          onClick={() => setToggleDensity(!toggleDensity)}
        >
          <p>Density</p>
          <p className="text-core text-sm capitalize">comfortable</p>
        </div>

        {toggleDensity && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ ease: "easeInOut" }}
            className="flex gap-4"
          >
            <img
              src="./download (1).jpg"
              style={{
                width: "calc((100% - 1rem) / 2)",
              }}
              className={`h-auto object-cover rounded-md ${selectedImage === 1 ? "ring-2 ring-core" : ""
                }`}
              onClick={() => handleImageClick(1)}
              alt="Image 1"
            />
            <img
              src="./download.jpg"
              style={{
                width: "calc((100% - 1rem) / 2)",
              }}
              className={`h-auto object-cover rounded-md ${selectedImage === 2 ? "ring-2 ring-core" : ""
                }`}
              onClick={() => handleImageClick(2)}
              alt="Image 2"
            />
          </motion.div>
        )}

        <div className="cursor-pointer">
          <p>Theme</p>

          <div className="mt-2 flex flex-wrap gap-4">
            <div
              className={`w-10 h-10 rounded-full border-[1px] border-gray-400 ${theme === "system" && "ring-2 ring-gray-600 dark:ring-gray-200"
                }`}
              style={{
                background: "linear-gradient(to left, black 50%, white 50%)",
                rotate: "-45deg"
              }}
              onClick={() => setTheme("system")}
            ></div>
            <div
              className={`w-10 h-10 rounded-full bg-black ${theme === "dark" && "ring-2 ring-gray-600 dark:ring-gray-200"
                }`}
              onClick={() => setTheme("dark")}
            ></div>
            <div
              className={`w-10 h-10 rounded-full border-[1px] border-gray-400 bg-white ${theme === "light" && "ring-2 ring-gray-600 dark:ring-gray-200"
                }`}
              onClick={() => setTheme("light")}
            ></div>

          </div>
          {/* <div className="flex justify-between mt-2">
              <p>Sync with system</p>
              <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-core"></div>
              </label>
            </div> */}
        </div>

        <div className="cursor-pointer">
          <p>Colors</p>
          <div className="flex gap-3 mt-2">
            <div className="flex flex-wrap gap-4">
              {Object.keys(ThemeColors).map((color, index) => (
                <div
                  key={index}
                  className={`w-10 h-10 rounded-full ${themeColor === color
                    ? "ring-2 ring-gray-600 dark:ring-gray-200"
                    : ""
                    }`}
                  style={{
                    background: ThemeColors[color as keyof typeof ThemeColors]
                  }}
                  onClick={() => setColorTheme(color as any)}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card hedding={"Preferences"}>
        <div className="flex justify-between cursor-pointer items-center">
          <span className="flex items-center gap-2">
            <p>Keyboard shortcuts</p><Kbd className="">Alt</Kbd>
          </span>
          <label className="inline-flex items-center cursor-pointer">
            <Switch id="kbds" />
          </label>
        </div>
        <div className="flex justify-between cursor-pointer">
          <p>Beta Access</p>
          <label className="inline-flex items-center cursor-pointer">
            <Switch id="betaa" />
          </label>
        </div>
        <div className="flex justify-between cursor-pointer">
          <p>Composer Full Screen</p>
          <label className="inline-flex items-center cursor-pointer">
            <Switch id="composerfull" />
          </label>
        </div>
      </Card>

      <Button variant={"secondary"} onClick={handleLogout} className="">
        <div className="flex items-center gap-2 ">
          <SignOut size={16} />
          <p>Log out</p>
        </div>
      </Button>

      <div className="flex flex-wrap gap-1 p-2 mt-2 justify-center text-xs text-gray-400">
        <a
          target="_blank"
          href="/"
          className="hover:underline  hover:text-black dark:hover:text-white"
        >
          About
        </a>
        •
        <a
          target="_blank"
          href="/"
          className="hover:underline hover:text-black dark:hover:text-white"
        >
          Help
        </a>
        •
        <a
          target="_blank"
          href="/"
          className="hover:underline hover:text-black dark:hover:text-white"
        >
          Contact
        </a>
        •
        <a
          target="_blank"
          href="/"
          className="hover:underline hover:text-black dark:hover:text-white"
        >
          Rellite
        </a>
        •
        <a
          target="_blank"
          href="/"
          className="hover:underline hover:text-black dark:hover:text-white"
        >
          Privacy And Policy
        </a>
      </div>

      

      {isAppModalOpen && (
        <Modal key="upgread" onClose={handleAppModel}>
          <Suspense fallback={"Loading..."}></Suspense>
        </Modal>
      )}


    </div>
  );
};

export { SettingSidebar };

interface card {
  hedding: string;
  children: ReactNode;
}

const Card = ({ hedding, children }: card) => {
  return (
    <div className="bg-sideBarCards-bg items-center rounded-lg justify-center w-full p-2 text-primary border border-sideBarCards-border">
      <div className="px-2 flex flex-col gap-4 mt-2 mb-3">
        <div className="">
          <h2 className="text-xs font-medium  text-gray-700 dark:text-gray-400">
            {hedding}
          </h2>
        </div>
        {children}
      </div>
    </div>
  );
};

export { Card };

export default Setting;
