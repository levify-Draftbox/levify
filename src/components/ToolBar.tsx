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

const ToolBar = () => {
  const [UpDown, setUpDown] = useState(false);
  return (
    <div className="w-full h-11 border-b-2 flex items-center justify-between px-5 selection:select-none">
      <div className="flex gap-3 items-center">
        <div
          onClick={() => {
            setUpDown(!UpDown);
          }}
          className=" flex items-center p-1 rounded-lg gap-1 hover:bg-[rgba(0,0,0,0.06)]"
        >
          <input className="h-5 w-5" type="checkbox" />
          {UpDown ? (
            <CaretUp weight="fill" size={12} />
          ) : (
            <CaretDown weight="fill" size={12} />
          )}
        </div>
        <h2 className="font-semibold text-lg">Inbox</h2>
        <div className="py-1 px-1 rounded-md hover:bg-[rgba(0,0,0,0.07)] ">
          <DotsThree weight="bold" size={18} />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button variant={"toolbutton"} size={"toolsize"} to={"/inbox"}>
          All
        </Button>
        <Button variant={"toolbutton"} size={"toolsize"} to={"/"}>
          Read
        </Button>
        <Button variant={"toolbutton"} size={"toolsize"} to={"/"}>
          Unread
        </Button>
        <Button variant={"toolbutton"} size={"toolsize"} to={"/"}>
          Has file
        </Button>

        <Button variant={"toolbutton"} size={"toolsize"}>
        <SortAscending size={20} />
        </Button>
        
        <div className="flex items-center gap-5 ml-2 text-[rgba(0,0,0,0.6)]">
          <CaretLeft size={14} />
          <p>1/1</p>
          <CaretRight size={14} />
        </div>
      </div>
    </div>
  );
};

export default ToolBar;
