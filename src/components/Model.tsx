import { X } from "@phosphor-icons/react";
import { FC, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Button } from "./ui/button";
import { AnimatePresence, motion } from "framer-motion";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";

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
        <motion.div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="bg-white w-[80%] h-[80%] rounded-lg"
          >
            <div className="w-full h-full">
              <ResizablePanelGroup
                className="min-h-full max-w-full rounded-lg border p-3"
                direction="horizontal"
              >
                <ResizablePanel minSize={13} maxSize={20} defaultSize={13}>
                  One
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel>
                  <div className="flex justify-between">
                    <div>
                      <h1>hello</h1>
                    </div>
                    <div>
                      <Button variant="toolbutton" onClick={handleCloseModal}>
                        <X size={20} />
                      </Button>
                    </div>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    portalRoot
  );
};

export default Modal;
