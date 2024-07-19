import React, { FC, useState, useEffect, ReactNode } from "react";
import ReactDOM from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import ScrollArea from "./ScrollArea";

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
            className="bg-background w-[65%] h-[75%] rounded-lg overflow-hidden"
          >
            {/* <div className="p-4 min-h-full"> */}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    portalRoot
  );
};

type ModalSidebarLayoutProps = {
  sidebar: React.ReactNode,
  children: React.ReactNode
}

export const ModalSidebarLayout: React.FC<ModalSidebarLayoutProps> = ({
  children,
  sidebar
}) => {
  return (
    <div className="h-full w-full">
      <ResizablePanelGroup
        className="min-h-full max-w-full rounded-lg"
        direction="horizontal"
      >
        <ResizablePanel
          minSize={18}
          maxSize={22}
          defaultSize={18}
          className="h-full"
        >
          <ScrollArea className="scroll-hide bg-background">
            {sidebar}
          </ScrollArea>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel>
          <div className="h-full overflow-auto scroll-bar bg-background-secondary">
            {children}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

export default Modal;
