import { X } from "@phosphor-icons/react";
import { FC, useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Button } from "./ui/button";
import { AnimatePresence, motion } from "framer-motion";

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
          transition={{ ease: "easeInOut", duration: .15 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ ease: "easeInOut", duration: .15 }}
            className="bg-white w-[80%] h-[80%] rounded-lg p-4"
          >
            <div className="flex justify-between">
              <h1>Modal</h1>
              <Button variant="toolbutton" onClick={handleCloseModal}>
                <X size={20} />
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    portalRoot
  );
};

export default Modal;
