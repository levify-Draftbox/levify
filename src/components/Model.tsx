import {
  BoxArrowUp,
  Globe,
  Key,
  Shield,
  SquaresFour,
  User,
  X,
} from "@phosphor-icons/react";
import { FC, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Button } from "./ui/button";
import { AnimatePresence, motion } from "framer-motion";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";
import { PaintRoller } from "lucide-react";

type ModalProps = {
  onClose: () => void;
};

const Modal: FC<ModalProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const portalRoot = document.querySelector(".reactPortal");

  if (!portalRoot) {
    throw new Error(
      "The element with class .reactPortal was not found in the document."
    );
  }

  const handleCloseModal = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    if (!isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 300); // Match this duration with your exit animation duration
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ ease: "easeInOut", duration: 0.15 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 modal--backdrop"
          onClick={(e) => {
            if (
              (e.target as HTMLElement).classList.contains("modal--backdrop")
            ) {
              handleCloseModal();
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ ease: "easeInOut", duration: 0.15 }}
            className="bg-background w-[80%] h-[80%] rounded-lg"
          >
            <ResizablePanelGroup
              className="min-h-full max-w-full rounded-lg border p-3"
              direction="horizontal"
            >
              <ResizablePanel minSize={14} maxSize={20} defaultSize={14}>
                <div>
                  <h1 className="font-semibold text-lg">All Settings</h1>
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
                      <p className="text-sm mt-3">Rellite Mail</p>
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
                    </div>
                  </div>
                </div>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel>
                <div className="flex justify-between">
                  <div>
                    <h1>
                      hello Lorem ipsum dolor sit amet consectetur adipisicing
                      elit. Dolorum necessitatibus laborum exercitationem
                      molestias repellendus inventore excepturi dignissimos
                      accusantium quos quae est, nam provident explicabo
                      accusamus tempore obcaecati aspernatur iusto? Tenetur!
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Iste, reiciendis alias. Totam enim voluptatibus alias quas
                      esse consequatur accusamus at tempore vero illum aperiam,
                      facilis porro earum. Quia, nemo tempore. Lorem ipsum dolor
                      sit amet consectetur adipisicing elit. Maiores eligendi
                      quasi debitis aliquam hic facilis consequatur quis nemo
                      tempora recusandae. Hic harum dignissimos corporis sed
                      magni fugit, recusandae quod itaque!Lorem

                    </h1>
                  </div>
                  <div>
                    <Button variant="toolbutton" onClick={handleCloseModal}>
                      <X size={20} />
                    </Button>
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    portalRoot
  );
};

export default Modal;

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
