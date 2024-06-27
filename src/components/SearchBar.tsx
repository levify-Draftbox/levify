import { Gear, MagnifyingGlass } from "@phosphor-icons/react";
import React from "react";

const SearchBar = () => {
  return (
    <div className="w-full h-[60px] border-b-2">
      <div className="flex h-full items-center justify-between px-3 py-[10px]">
        <div className="flex bg-[rgba(0,0,0,0.06)] h-full items-center px-3 rounded-lg">
            <MagnifyingGlass size={18}/>
          <input
            className="bg-transparent w-96 p-2 outline-none"
            src="text"
            placeholder="Search Message"
          />
        </div>
        <div className="flex items-center gap-4">
            <Gear size={23}/>
            <div className="text-right ">
                <p className="text-sm">raviitaliya</p>
                <p className="text-[0.800rem] text-[rgba(0,0,0,0.7)] dark:text-[rgba(250,250,250,0.7)]">hello@raviitaliya.info</p>
            </div>
            <div className="w-8 h-8 border-2 cursor-pointer rounded-lg flex items-center justify-center hover:bg-[rgba(0,0,0,0.07)] dark:hover:bg-[rgba(250,250,250,0.2)]">
                <p>R</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
