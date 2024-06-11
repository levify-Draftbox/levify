import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { IoHomeOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";
import { IoSunnyOutline } from "react-icons/io5";
import { IoMoonOutline } from "react-icons/io5";

const SideBar = () => {
  const [ToggleTheme, setToggleTheme] = useState(false);

  useEffect(() => {
    if (ToggleTheme === true) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [ToggleTheme]);

  return (
    <div className="flex flex-col justify-between h-full text-[#5f5e5b] p-2 bg-[#f7f7f5] dark:bg-[#202020] ">
      <div className="w-full flex flex-col mt-5">
        <div className="flex w-full px-3 py-4 h-10 rounded-md hover:bg-[#ededeb] dark:hover:bg-[#383838]">
          <div className="flex items-center justify-center gap-3">
            <IoSearch fontSize={22} className="dark:text-[#a3a3a3]"/>
            <h1 className="text-lg dark:text-[#a3a3a3]">Search</h1>
          </div>
        </div>
        <div className="flex w-full px-3 py-4 h-10 rounded-md hover:bg-[#ededeb] dark:hover:bg-[#383838]">
          <div className="flex items-center justify-center gap-3">
            <IoHomeOutline fontSize={22} className="dark:text-[#a3a3a3]"/>
            <h1 className="text-lg dark:text-[#a3a3a3]">Home</h1>
          </div>
        </div>
      </div>

      <div className="w-full flex flex-col mb-2">
        <div
          onClick={() => setToggleTheme(!ToggleTheme)}
          className="flex w-full px-3 py-4 h-10 rounded-md hover:bg-[#ededeb] dark:hover:bg-[#383838]"
        >
          <div className="flex items-center justify-center gap-3">
            {ToggleTheme ? (
              <IoSunnyOutline fontSize={23} className="dark:text-[#a3a3a3]"/>
            ) : (
              <IoMoonOutline fontSize={23} className="dark:text-[#a3a3a3]"/>
            )}
            {ToggleTheme ? (
              <h1 className="text-lg dark:text-[#a3a3a3]">Light</h1>
            ) : (
              <h1 className="text-lg dark:text-[#a3a3a3]">Dark</h1>
            )}
          </div>
        </div>
        <div className="flex w-full px-3 py-4 h-10 rounded-md hover:bg-[#ededeb] dark:hover:bg-[#383838]">
          <div className="flex items-center justify-center gap-3">
            <IoLogOutOutline fontSize={22} className="dark:text-[#a3a3a3]"/>
            <h1 className="text-lg dark:text-[#a3a3a3]">Logout</h1>
          </div>
        </div>
        <div className="flex w-full px-3 py-4 h-10 rounded-md hover:bg-[#ededeb] dark:hover:bg-[#383838]">
          <div className="flex items-center justify-center gap-3">
            <IoSettingsOutline fontSize={22} className="dark:text-[#a3a3a3]"/>
            <h1 className="text-lg dark:text-[#a3a3a3]">Setting</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
