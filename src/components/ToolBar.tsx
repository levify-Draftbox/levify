import {
  CaretDown,
  CaretLeft,
  CaretRight,
  CaretUp,
  DotsThree,
  SortAscending,
} from "@phosphor-icons/react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Checkbox } from "@/components/ui/checkbox";

const ToolBar = () => {
  const [UpDown, setUpDown] = useState(false);
  return (
    <div className="w-full h-11 border-b flex items-center justify-between px-5 selection:select-none">
      <div className="flex gap-3 items-center">
        <div className=" flex items-center p-1 rounded-lg gap-1 hover:bg-[rgba(0,0,0,0.06)]">
          {/* <input className="h-5 w-5" type="checkbox" /> */}
          <Checkbox />
          <div
            onClick={() => {
              setUpDown(!UpDown);
            }}
          >
            {UpDown ? (
              <CaretUp weight="fill" size={12} />
            ) : (
              <CaretDown weight="fill" size={12} />
            )}
          </div>
        </div>
        <h2 className="font-semibold text-lg">Inbox</h2>
        <div className="py-1 px-1 rounded-md hover:bg-[rgba(0,0,0,0.07)] ">
          <DotsThree weight="bold" size={18} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant={"toolbutton"} className="!py-1 !px-3" size={"toolsize"} to={"/inbox"}>
          All
        </Button>
        <Button variant={"toolbutton"} className="!py-1 !px-3" size={"toolsize"} to={"/"}>
          Read
        </Button>
        <Button variant={"toolbutton"} className="!py-1 !px-3" size={"toolsize"} to={"/"}>
          Unread
        </Button>
        <Button variant={"toolbutton"} className="!py-1 !px-3" size={"toolsize"} to={"/"}>
          Has file
        </Button>

        <Button variant={"toolbutton"} className="!py-1 !px-3" size={"toolsize"}>
          <SortAscending size={20} />
        </Button>

        <div className="flex items-center gap-4 ml-2 text-[rgba(0,0,0,0.6)] dark:text-[rgba(250,250,250,0.8)]">
          <Button variant={"toolbutton"}>
            <CaretLeft size={14} />
          </Button>
          <p>1/1</p>
          <Button variant={"toolbutton"}>
            <CaretRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ToolBar;
