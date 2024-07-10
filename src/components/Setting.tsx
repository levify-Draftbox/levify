import { X } from "@phosphor-icons/react";
import { Button } from "./ui/button";
import { ResizableHandle, ResizablePanel } from "./ui/resizable";
import { motion } from "framer-motion";
import { useState } from "react";

type SearchBarProp = {
  onSettingToggle: () => void;
};

const Setting = ({ onSettingToggle }: SearchBarProp) => {
  return (
    <>
      <ResizableHandle />
      <ResizablePanel defaultSize={19}>
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ stiffness: 200, duration: 0.25 }}
          className="h-full bg-inbox-bg"
        >
          <div className="p-3 ">
            <div className=" flex justify-between">
              <h1 className="my-auto">Settings</h1>
              <Button
                variant={"toolbutton"}
                size={"toolsize"}
                className="h-8"
                onClick={() => onSettingToggle()}
              >
                <X size={20} />
              </Button>
            </div>
            <div className="mt-3">
              <SettingSidebar />
            </div>
          </div>
        </motion.div>
      </ResizablePanel>
    </>
  );
};
const SettingSidebar = () => {
  const [toggleLayout, settoggleLayout] = useState(false);
  const [toggleDensity, settoggleDensity] = useState(false);
  const [togglecomposer, settogglecomposer] = useState(false);

  return (
    <div>
      <Button variant={"superActive"} className="my-2">
        All Settings
      </Button>
      <Button variant={"whiteButton"} className="mt-2">
        Get the Rellite Mail app
      </Button>
      <div className="bg-white mt-3 items-center rounded-lg justify-center w-full p-2 text-primary shadow dark:bg-[rgba(250,250,250,0.1)]">
        <div className="px-2 flex flex-col gap-4">
          <div
            className="flex justify-between cursor-pointer"
            onClick={() => settoggleLayout(!toggleLayout)}
          >
            <p>Layout</p>
            <p className="text-core text-sm capitalize">row</p>
          </div>

          {toggleLayout && (
            <motion.div
            initial={{y:-20,opacity:0}}
            animate={{y:0,opacity:1}}
            className="flex gap-4">
              <div className="w-28 h-16 bg-black"></div>
              <div className="w-28 h-16 bg-core"></div>
            </motion.div>
          )}

          <div className="flex justify-between cursor-pointer"
          onClick={() => settoggleDensity(!toggleDensity)}>
            <p>Density</p>
            <p className="text-core text-sm capitalize">comfortable</p>
          </div>

          {toggleDensity && (
            <motion.div
            initial={{y:-20,opacity:0}}
            animate={{y:0,opacity:1}}
            className="flex gap-4">
              <div className="w-28 h-16 bg-black"></div>
              <div className="w-28 h-16 bg-core"></div>
            </motion.div>
          )}
          <div className="flex justify-between cursor-pointer"
          onClick={() => settogglecomposer(!togglecomposer)}>
            <p>composer</p>
            <p className="text-core text-sm capitalize">Normal</p>
          </div>

          {togglecomposer && (
            <motion.div
            initial={{y:-20,opacity:0}}
            animate={{y:0,opacity:1}}
            className="flex gap-4">
              <div className="w-28 h-16 bg-black"></div>
              <div className="w-28 h-16 bg-core"></div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="bg-white mt-3 items-center rounded-lg justify-center w-full p-2 text-primary shadow dark:bg-[rgba(250,250,250,0.1)]">
        <div className="px-2 flex flex-col gap-6 mt-2">
          <div className="flex justify-between cursor-pointer">
            <p>Keyboard shortcuts</p>
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-core"></div>
            </label>
          </div>
          <div className="flex justify-between cursor-pointer">
            <p>Beta Access</p>
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-core"></div>
            </label>
          </div>

          <div className="cursor-pointer">
            <p>
              <strong>Theme: </strong>Rellite
            </p>
            <div className="flex justify-between mt-2">
              <p>Sync with system</p>
              <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-core"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { SettingSidebar };

export default Setting;
