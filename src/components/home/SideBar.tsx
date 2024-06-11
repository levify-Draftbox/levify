import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { IoHomeOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";
import { IoSunnyOutline } from "react-icons/io5";
import { IoMoonOutline } from "react-icons/io5";

const SideBar = () => {
  const [ToggleTheme, setToggleTheme] = useState(false);
  return (
    <div className="flex flex-col justify-between h-full dark:bg-black">
      <div className="w-full flex flex-col mt-5">
        <div className="flex w-full px-3 py-4 h-10 rounded-md hover:bg-gray-200">
          <div className="flex items-center justify-center gap-3">
            <IoSearch fontSize={22} />
            <h1 className="text-lg">Search</h1>
          </div>
        </div>
        <div className="flex w-full px-3 py-4 h-10 rounded-md hover:bg-gray-200">
          <div className="flex items-center justify-center gap-3">
            <IoHomeOutline fontSize={22} />
            <h1 className="text-lg">Home</h1>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col mb-2">
        <div
          onClick={() => setToggleTheme(!ToggleTheme)}
          className="flex w-full px-3 py-4 h-10 rounded-md hover:bg-gray-200"
        >
          <div className="flex items-center justify-center gap-3">
            {ToggleTheme ? (
              <IoSunnyOutline fontSize={23} />
            ) : (
              <IoMoonOutline fontSize={23} />
            )}
            {ToggleTheme ? (
              <h1 className="text-lg">Light</h1>
            ) : (
              <h1 className="text-lg">Dark</h1>
            )}
          </div>
        </div>
        <div className="flex w-full px-3 py-4 h-10 rounded-md hover:bg-gray-200">
          <div className="flex items-center justify-center gap-3">
            <IoLogOutOutline fontSize={22} />
            <h1 className="text-lg">Logout</h1>
          </div>
        </div>
        <div className="flex w-full px-3 py-4 h-10 rounded-md hover:bg-gray-200 ">
          <div className="flex items-center justify-center gap-3">
            <IoSettingsOutline fontSize={22} />
            <h1 className="text-lg">Setting</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
