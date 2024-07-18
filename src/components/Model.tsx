import { FC, useState, useEffect, ReactNode } from "react";
import ReactDOM from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "./ui/button";
import { X } from "@phosphor-icons/react";

type ModalProps = {
  onClose: () => void;
  children: ReactNode;
};

const Modal: FC<ModalProps> = ({ onClose, children }) => {
  const [isVisible, setIsVisible] = useState(true);
  const portalRoot = document.querySelector("#reactPortal");

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
          className="z-[999999] fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 modal--backdrop dark:bg-opacity-80 "
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
            className="bg-background w-[80%] h-[80%] rounded-lg dark:border "
          >
            <div className="p-4 min-h-full">
              <div className="flex justify-between">
                <h1>All settings</h1>
                <div>
                  <Button variant="toolbutton" onClick={handleCloseModal}>
                    <X size={20} />
                  </Button>
                </div>
              </div>
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    portalRoot
  );
};

export default Modal;

// type SidebarNavLinkProp = {
//   icon: React.ReactNode;
//   children: React.ReactNode;
//   to?: string;
//   unread?: number;
// };
// function SidebarNavLink(p: SidebarNavLinkProp) {
//   return (
//     <Button variant={"navlink"} to={p.to || "/"}>
//       <div className="flex gap-2">
//         {p.icon}
//         <p className="text-sm">{p.children}</p>
//       </div>
//     </Button>
//   );
// }
