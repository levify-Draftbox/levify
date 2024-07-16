import { Button } from "./ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useState } from "react";
import { Progress } from "@/components/ui/progress";
import Modal from "./Model"; // Make sure to import Modal correctly
import { ChevronRight } from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";
import { PaintRoller } from "lucide-react";
import {
  BoxArrowUp,
  Globe,
  Key,
  Shield,
  SquaresFour,
  User,
} from "@phosphor-icons/react";

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
          className="!h-[100vh] overflow-auto select-none"
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
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleButtonClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleImageClick = (index: number) => {
    setSelectedImage(index);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDivClick = (index: number) => {
    setSelectedIndex(index);
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
      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <ResizablePanelGroup
            className="min-h-full max-w-full rounded-lg mt-2"
            direction="horizontal"
          >
            <ResizablePanel minSize={14} maxSize={20} defaultSize={14}>
              <div>
                <div>
                  <div className="mt-3">
                    <p className="text-sm">Account</p>
                    <div className="mt-2">
                      <SidebarNavLink
                        icon={<SquaresFour size={18} />}
                        to="/inbox/dashbord"
                      >
                        Dashbord
                      </SidebarNavLink>
                    </div>
                    <div className="mt-1">
                      <SidebarNavLink
                        icon={<BoxArrowUp size={18} />}
                        to="/inbox/star"
                      >
                        Upgread plan
                      </SidebarNavLink>
                    </div>
                    <div className="mt-1">
                      <SidebarNavLink
                        icon={<Key size={18} />}
                        to="/inbox/recovery"
                      >
                        Recovery
                      </SidebarNavLink>
                    </div>
                    <div className="mt-1">
                      <SidebarNavLink
                        icon={<User size={18} />}
                        to="/inbox/account"
                      >
                        Account and Password
                      </SidebarNavLink>
                    </div>
                    <div className="mt-1">
                      <SidebarNavLink
                        icon={<Globe size={18} />}
                        to="/inbox/star"
                      >
                        Language and time
                      </SidebarNavLink>
                    </div>
                    <div className="mt-1">
                      <SidebarNavLink
                        icon={<PaintRoller size={18} />}
                        to="/inbox/appearance"
                      >
                        Appearance
                      </SidebarNavLink>
                    </div>
                    <div className="mt-1">
                      <SidebarNavLink
                        icon={<Shield size={18} />}
                        to="/inbox/appearance"
                      >
                        Security and privacy
                      </SidebarNavLink>
                    </div>
                  </div>
                  <div>
                    <div className="mt-3">
                      <p className="text-sm">Rellite Mail</p>
                      <div className="mt-2">
                        <SidebarNavLink
                          icon={<SquaresFour size={18} />}
                          to="/inbox/dashbord"
                        >
                          Dashbord
                        </SidebarNavLink>
                      </div>
                      <div className="mt-1">
                        <SidebarNavLink
                          icon={<BoxArrowUp size={18} />}
                          to="/inbox/star"
                        >
                          Upgread plan
                        </SidebarNavLink>
                      </div>
                      <div className="mt-1">
                        <SidebarNavLink
                          icon={<Key size={18} />}
                          to="/inbox/recovery"
                        >
                          Recovery
                        </SidebarNavLink>
                      </div>
                      <div className="mt-1">
                        <SidebarNavLink
                          icon={<User size={18} />}
                          to="/inbox/account"
                        >
                          Account and Password
                        </SidebarNavLink>
                      </div>
                      <div className="mt-1">
                        <SidebarNavLink
                          icon={<Globe size={18} />}
                          to="/inbox/star"
                        >
                          Language and time
                        </SidebarNavLink>
                      </div>
                      <div className="mt-1">
                        <SidebarNavLink
                          icon={<PaintRoller size={18} />}
                          to="/inbox/appearance"
                        >
                          Appearance
                        </SidebarNavLink>
                      </div>
                      <div className="mt-1">
                        <SidebarNavLink
                          icon={<Shield size={18} />}
                          to="/inbox/appearance"
                        >
                          Security and privacy
                        </SidebarNavLink>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel>
              <div className="flex justify-between">
                <div className="p-3">
                  <h1>
                    hello Lorem ipsum dolor sit amet consectetur adipisicing
                    elit. Dolorum necessitatibus laborum exercitationem
                    molestias repellendus inventore excepturi dignissimos
                    accusantium quos quae est, nam provident explicabo accusamus
                    tempore obcaecati aspernatur iusto? Tenetur! Lorem ipsum
                    dolor sit amet consectetur adipisicing elit. Iste,
                    reiciendis alias. Totam enim voluptatibus alias quas esse
                    consequatur accusamus at tempore vero illum aperiam, facilis
                    porro earum. Quia, nemo tempore. Lorem ipsum dolor sit amet
                    consectetur adipisicing elit. Maiores eligendi quasi debitis
                    aliquam hic facilis consequatur quis nemo tempora
                    recusandae. Hic harum dignissimos corporis sed magni fugit,
                    recusandae quod itaque!Lorem
                  </h1>
                </div>
                
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </Modal>
      )}
        <Button variant={"whiteButton"} className="mt-2">
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
        <Button variant={"superActive"} className="capitalize">
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
              className={`h-auto object-cover rounded-md ${
                selectedImage === 1 ? "ring-2 ring-core" : ""
              }`}
              onClick={() => handleImageClick(1)}
              alt="Image 1"
            />
            <img
              src="./download.jpg"
              style={{
                width: "calc((100% - 1rem) / 2)",
              }}
              className={`h-auto object-cover rounded-md ${
                selectedImage === 2 ? "ring-2 ring-core" : ""
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
              className={`h-auto object-cover rounded-md ${
                selectedImage === 1 ? "ring-2 ring-core" : ""
              }`}
              onClick={() => handleImageClick(1)}
              alt="Image 1"
            />
            <img
              src="./download.jpg"
              style={{
                width: "calc((100% - 1rem) / 2)",
              }}
              className={`h-auto object-cover rounded-md ${
                selectedImage === 2 ? "ring-2 ring-core" : ""
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

        <div className="cursor-pointer">
          <p>
            <strong>Colors: </strong>
          </p>
          <div className="flex gap-3 mt-2">
            <div className="flex space-x-2">
              {[
                "bg-red-600",
                "bg-green-600",
                "bg-blue-600",
                "bg-black",
                "bg-yellow-600",
              ].map((color, index) => (
                <div
                  key={index}
                  className={`w-10 h-10 rounded-full ${color} ${
                    selectedIndex === index
                      ? "ring-2 ring-offset-1 ring-core"
                      : ""
                  }`}
                  onClick={() => handleDivClick(index)}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card hedding={"Preferences"}>
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
      </Card>

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
    <div className="bg-white mt-3 items-center rounded-lg justify-center w-full p-2 text-primary shadow-lg dark:bg-[rgba(250,250,250,0.12)]">
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

type SidebarNavLinkProp = {
  icon: React.ReactNode;
  children: React.ReactNode;
  to?: string;
  unread?: number;
};
function SidebarNavLink(p: SidebarNavLinkProp) {
  return (
    <Button variant={"navlink"} to={p.to || "/"}>
      <div className="flex gap-2">
        {p.icon}
        <p className="text-sm">{p.children}</p>
      </div>
    </Button>
  );
}

export default Setting;
