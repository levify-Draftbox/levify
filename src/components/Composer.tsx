import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "./ui/button";
import { ArrowsOutSimple, Minus, X } from "@phosphor-icons/react";
import Blocknote from "./BlockNote";
import Draggable from 'react-draggable';
import { motion, AnimatePresence } from 'framer-motion';

type ComposerProps = {
  isOpen: boolean;
  onClose: () => void;
}

const Composer: React.FC<ComposerProps> = ({ isOpen, onClose }) => {
  const [showCc, setShowCc] = useState<boolean>(false);
  const [showBcc, setShowBcc] = useState<boolean>(false);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);

  if (!isOpen) return null;

  const toggleFullScreen = () => {
    setIsFullScreen(prev => !prev);
  };

  return createPortal(
    <AnimatePresence>
      <motion.div
        className={`fixed z-50 ${isFullScreen ? 'inset-0 flex items-center justify-center' : 'bottom-0 right-0'}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
        style={{
          height: isFullScreen ? "100vh" : "600px",
          width: isFullScreen ? "100vw" : "550px",
          overflow: "hidden", // Hide scrollbars
        }}
      >
        <Draggable
          axis={isFullScreen ? "none" : "both"} // Enable dragging in small screen mode
          bounds={isFullScreen ? 'body' : 'body'}
          disabled={isFullScreen} // Disable dragging in fullscreen mode
        >
          <motion.div
            className={`shadow-xl bg-white border-2 rounded-lg ${isFullScreen ? 'relative' : 'relative'} z-50`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            style={{
              height: isFullScreen ? "96vh" : "600px",
              width: isFullScreen ? "96vw" : "550px",
              overflow: "hidden", // Hide scrollbars
              position: isFullScreen ? "relative" : "absolute",
            }}
          >
            <div className="w-full h-10 bg-core cursor-move flex items-center justify-between pl-4 pr-2 rounded-t-lg">
              <p className="text-white">New Message</p>
              <div className="">
                <Button variant={"toolbutton"}>
                  <Minus className="text-white" size={18} />
                </Button>
                <Button variant={"toolbutton"} onClick={toggleFullScreen}>
                  <ArrowsOutSimple className="text-white" size={18} />
                </Button>
                <Button variant={"toolbutton"} onClick={onClose}>
                  <X className="text-white" size={18} />
                </Button>
              </div>
            </div>

            <div className="px-4">
              <div className="flex flex-col">
                <div className="flex gap-2 border-b-[1px] items-center">
                  <p className="pl-2 text-gray-500">To</p>
                  <input className="w-full p-2 outline-none" />
                  <div className="flex gap-2">
                    {!showCc && (
                      <p
                        className="hover:underline text-gray-500 cursor-pointer"
                        onClick={() => setShowCc(true)}
                      >
                        Cc
                      </p>
                    )}
                    {!showBcc && (
                      <p
                        className="hover:underline text-gray-500 cursor-pointer"
                        onClick={() => setShowBcc(true)}
                      >
                        Bcc
                      </p>
                    )}
                  </div>
                </div>
                {showCc && (
                  <div className="flex gap-2 border-b-[1px] items-center">
                    <p className="pl-2 text-gray-500">Cc</p>
                    <input className="w-full p-2 outline-none" />
                  </div>
                )}
                {showBcc && (
                  <div className="flex gap-2 border-b-[1px] items-center">
                    <p className="pl-2 text-gray-500">Bcc</p>
                    <input className="w-full p-2 outline-none" />
                  </div>
                )}
              </div>
              <div className="border-b-[1px]">
                <input className="w-full p-2 outline-none " placeholder="subject" />
              </div>
            </div>
            <div className="w-full h-full mt-2">
              <Blocknote />
            </div>
          </motion.div>
        </Draggable>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default Composer;
