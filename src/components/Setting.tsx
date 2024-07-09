import { X } from "@phosphor-icons/react";
import { Button } from "./ui/button";
import { ResizableHandle, ResizablePanel } from "./ui/resizable";
import { motion } from "framer-motion";

type SearchBarProp = {
  onSettingToggle: () => void;
};

const Setting = ({ onSettingToggle }: SearchBarProp) => {
  return (
    <>
      <ResizableHandle />
      <ResizablePanel minSize={10} maxSize={20} defaultSize={13}>
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ stiffness: 200,duration:0.25}}
        >
          <div className="p-3">
            <div className=" flex justify-between">
              <h1 className="my-auto">Settings</h1>
              <Button
                variant={"toolbutton"}
                size={"toolsize"}
                className="h-8"
                onClick={() => onSettingToggle()}
              >
                <X size={20} />
              </Button>
            </div>
            <div className="mt-3">
                <h1>hello</h1>
                <h1>hello</h1>
                <h1>hello</h1>
                <h1>hello</h1>
                <h1>hello</h1>
                <h1>hello</h1>
                <h1>hello</h1>
                <h1>hello</h1>
                <h1>hello</h1>
                <h1>hello</h1>
                <h1>hello</h1>
                <h1>hello</h1>
                <h1>hello</h1>
                <h1>hello</h1>
                <h1>hello</h1>
                <h1>hello</h1>
                <h1>hello</h1>

            </div>
          </div>
        </motion.div>
      </ResizablePanel>
    </>
  );
};

export default Setting;
