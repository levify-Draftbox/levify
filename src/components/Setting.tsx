import { Button } from "./ui/button";
import { ResizableHandle, ResizablePanel } from "./ui/resizable";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import Modal from "./Model"; // Make sure to import Modal correctly
import { ChevronRight } from "lucide-react";

type SearchBarProp = {
  onSettingToggle: () => void;
};

const Setting = ({ onSettingToggle }: SearchBarProp) => {
  return (
    <>
      <ResizableHandle />
      <ResizablePanel defaultSize={20}>
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ stiffness: 200, duration: 0.25 }}
          className="!h-[100vh] overflow-auto bg-inbox-bg select-none"
        >
          <div className="p-3 h-[100vh] overflow-auto scroll-bar">
            <div className="flex justify-between">
              <h1 className="my-auto">Settings</h1>
              <Button
                variant={"toolbutton"}
                size={"toolsize"}
                className="h-8"
                onClick={() => onSettingToggle()}
              >
                <ChevronRight size={20} />
              </Button>
            </div>
            <div>
              <AnimatePresence>
                <SettingSidebar />
              </AnimatePresence>
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
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const handleButtonClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleImageClick = (index: number) => {
    setSelectedImage(index);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <Button
        onClick={handleButtonClick}
        variant="superActive"
        className="my-2"
      >
        All Settings
      </Button>
      {isModalOpen && <Modal onClose={handleCloseModal} />}
      <div className="flex w-full justify-between">
        <img style={{ width: "calc((100% - .5rem) / 2)", borderRadius: "6px" }} className="h-auto cursor-pointer dark:border" src={"/getgoogleplay.png"} alt={"Get From Google Play"} />
        <img style={{ width: "calc((100% - .5rem) / 2)", borderRadius: "6px" }} className="h-auto cursor-pointer dark:border" src={"/getappstore.png"} alt={"Get From App Store"} />
      </div>

      <div className="bg-white mt-3 items-center rounded-lg justify-center w-full p-2 text-primary shadow dark:bg-[rgba(250,250,250,0.1)]">
        <div className="px-2 flex flex-col gap-3 mt-2 mb-3">
          <div className="mb-1">
            <h2 className="text-xs text-gray-700 dark:text-gray-400">Your Plan</h2>
          </div>
          <div className="w-full pt-1 px-1">
            <Progress value={10} />
            <div className="text-xs flex justify-between mt-2">
              <div className="flex">
                <span className="font-semibold">200 MB </span>
                <p>/ 2.0 GB</p>
              </div>
            </div>
          </div>
          <Button variant={"superActive"} className="capitalize">
            Upgrade your plan
          </Button>
        </div>
      </div>

      <div className="bg-white mt-3 items-center rounded-lg justify-center w-full p-2 text-primary shadow dark:bg-[rgba(250,250,250,0.1)]">
        <div className="px-2 flex flex-col gap-4 mt-2 mb-3">
          <div className="">
            <h2 className="text-xs text-gray-700 dark:text-gray-400">Personalization</h2>
          </div>
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
                  width: "calc((100% - 1rem) / 2)"
                }}
                className={`h-auto object-cover rounded-md ${selectedImage === 1 ? "ring-2 ring-core" : ""
                  }`}
                onClick={() => handleImageClick(1)}
                alt="Image 1"
              />
              <img
                src="./download.jpg"
                style={{
                  width: "calc((100% - 1rem) / 2)"
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
                  width: "calc((100% - 1rem) / 2)"
                }}
                className={`h-auto object-cover rounded-md ${selectedImage === 1 ? "ring-2 ring-core" : ""
                  }`}
                onClick={() => handleImageClick(1)}
                alt="Image 1"
              />
              <img
                src="./download.jpg"
                style={{
                  width: "calc((100% - 1rem) / 2)"
                }}
                className={`h-auto object-cover rounded-md ${selectedImage === 2 ? "ring-2 ring-core" : ""
                  }`}
                onClick={() => handleImageClick(2)}
                alt="Image 2"
              />
            </motion.div>
          )}

          <div className="cursor-pointer">
            <p>
              <strong>Theme: </strong>Rellite
            </p>
            {/* <div className="flex justify-between mt-2">
              <p>Sync with system</p>
              <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" />
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-core"></div>
              </label>
            </div> */}
          </div>
        </div>
      </div>

      <div className="bg-white mt-3 items-center rounded-lg justify-center w-full p-2 text-primary shadow dark:bg-[rgba(250,250,250,0.1)]">
        <div className="px-2 flex flex-col gap-4 mt-2 mb-3">
          <div className="">
            <h2 className="text-xs text-gray-700 dark:text-gray-400">Preferences</h2>
          </div>
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
          <div className="flex justify-between cursor-pointer">
            <p>Composer Full Screen</p>
            <label className="inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-core"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 p-2 mt-2 justify-center text-xs text-gray-400">
        <a target="_blank" href="/" className="hover:underline hover:text-gray-50">
          About
        </a>
        •
        <a target="_blank" href="/" className="hover:underline hover:text-gray-50">
          Help
        </a>
        •
        <a target="_blank" href="/" className="hover:underline hover:text-gray-50">
          Contact
        </a>
        •
        <a target="_blank" href="/" className="hover:underline hover:text-gray-50">
          Rellite
        </a>
        •
        <a target="_blank" href="/" className="hover:underline hover:text-gray-50">
          Privacy And Policy
        </a>
      </div>
    </div>
  );
};

export { SettingSidebar };

export default Setting;
