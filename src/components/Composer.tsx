import React, { useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "./ui/button";
import { ArrowsInSimple, Minus, X } from "@phosphor-icons/react";
import Blocknote from "./BlockNote";

const Composer = ({ isOpen, onClose }) => {
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);

  if (!isOpen) return null;

  return createPortal(
    <div className="flex inset-0 w-full z-20 items-center justify-center ">
      <div className="h-[600px] w-[550px] shadow-xl bg-white border-2 rounded-lg absolute bottom-2 right-2">
        <div className="w-full h-10 bg-core flex items-center justify-between pl-4 pr-2 rounded-t-lg">
          <p className="text-white">New Message</p>
          <div className="">
            <Button variant={"toolbutton"}>
              <Minus className="text-white " size={18} />
            </Button>
            <Button variant={"toolbutton"}>
              <ArrowsInSimple className="text-white " size={18} />
            </Button>
            <Button variant={"toolbutton"} onClick={onClose}>
              <X className="text-white " size={18} />
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
        <div className=" w-full h-full mt-2 ">
          <Blocknote />
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Composer;