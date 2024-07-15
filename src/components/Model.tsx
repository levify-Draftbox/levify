import { FC, useState, useEffect, ReactNode } from "react";
import ReactDOM from "react-dom";
import { AnimatePresence, motion } from "framer-motion";

import { ThemeProvider } from "./Theme-provider";

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
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
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
              <div className="p-4 font-semibold">
                <h1>All settings</h1>
                {children}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ThemeProvider>,
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
