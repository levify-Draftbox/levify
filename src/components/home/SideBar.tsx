import React from "react";
import { IoSearch } from "react-icons/io5";
import { GoHome } from "react-icons/go";
import { IoSettingsOutline } from "react-icons/io5";
import { BiLogOut } from "react-icons/bi";

const SideBar = () => {
  return (
    <div className="flex flex-col justify-between h-full">
      <div className="w-full flex flex-col mt-5">
        <div className="flex w-full px-3 py-4 h-7 rounded-md hover:bg-gray-200">
          <div className="flex items-center justify-center gap-2">
            <IoSearch fontSize={23} />
            <h1 className="text-lg">Search</h1>
          </div>
        </div>
        <div className="flex w-full px-3 py-4 h-10 rounded-md hover:bg-gray-200">
          <div className="flex items-center justify-center gap-2">
            <GoHome fontSize={25} />
            <h1 className="text-lg">Home</h1>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col mb-2">
        <div className="flex w-full px-3 py-4 h-10 rounded-md hover:bg-gray-200">
          <div className="flex items-center justify-center gap-2">
            <BiLogOut fontSize={25} />
            <h1 className="text-lg">Logout</h1>
          </div>
        </div>
        <div className="flex w-full px-3 py-4 h-10 rounded-md hover:bg-gray-200 ">
          <div className="flex items-center justify-center gap-2">
            <IoSettingsOutline fontSize={25} />
            <h1 className="text-lg">Setting</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
