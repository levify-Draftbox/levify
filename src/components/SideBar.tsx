import { IoSearch } from "react-icons/io5";
import { IoHomeOutline } from "react-icons/io5";
import { IoSettingsOutline } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";
import { IoSunnyOutline } from "react-icons/io5";
import { IoMoonOutline } from "react-icons/io5";
import { NavLink } from "react-router-dom";
import { useTheme } from "./Theme-provider";
import Document from "./Document";

const SideBar = () => {
  const { setTheme, theme } = useTheme();

  const handleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <div className="flex flex-col justify-between h-full text-[#5f5e5b] p-2 bg-[#f7f7f5] dark:bg-transparent">
      <div className="w-full flex flex-col mt-1">
        <div className="flex w-full px-3 h-10 rounded-md overflow-hidden hover:bg-[rgba(0,0,0,0.06)] cursor-pointer dark:hover:bg-[rgba(255,255,255,0.2)]">
          <div className="flex items-center justify-center gap-3 flex-shrink-0">
            <div className="w-5 h-5 rounded-sm bg-white"></div>
            <p className="dark:text-[#d5d5d5] max-w-40 truncate">user</p>
          </div>
        </div>

        <div className="flex w-full px-3 py-4 h-10 rounded-md hover:bg-[rgba(0,0,0,0.06)] cursor-pointer dark:hover:bg-[rgba(255,255,255,0.2)]">
          <div className="flex items-center justify-center gap-3">
            <IoSearch
              fontSize={20}
              className="text-[#91918e] dark:text-[#a3a3a3]"
            />
            <h1 className=" dark:text-[#a3a3a3]">Search</h1>
          </div>
        </div>

        <NavLink
          to={"/"}
          className={({ isActive }) => {
            return (
              "flex w-full px-3 py-4 h-10 rounded-md hover:bg-[rgba(0,0,0,0.06)] hover:cursor-pointer dark:hover:bg-[rgba(255,255,255,0.2)] " +
              (isActive ? "bg-[rgba(0,0,0,0.05)] dark:bg-[rgba(255,255,255,0.2)]" : "")
            );
          }}
        >
          <div className="flex items-center justify-center gap-3">
            <IoHomeOutline
              fontSize={20}
              className="text-[#91918e] dark:text-[#a3a3a3]"
            />
            <h1 className=" dark:text-[#a3a3a3]">Home</h1>
          </div>
        </NavLink>

        <div>
          <div className="flex w-full px-3 py-4 h-10 cursor-pointer rounded-md hover:bg-[rgba(0,0,0,0.06)] dark:hover:bg-[rgba(255,255,255,0.2)] mt-5">
            <div className="flex items-center justify-center gap-3">
              <h1 className="text-base text-[#91918e] dark:text-[#a3a3a3]">
                Pages
              </h1>
            </div>
          </div>

          <Document name={"document"} route={"/page1"} />
          <Document name={"document"} route={"/page2"} />
          <Document name={"document"} route={"/page3"} />
          <Document name={"document"} route={"/page4"} />
        </div>
      </div>

      <div className="w-full flex flex-col mb-2">
        <div
          onClick={handleTheme}
          className="flex w-full px-3 py-4 h-10 rounded-md cursor-pointer hover:bg-[rgba(0,0,0,0.06)] dark:hover:bg-[rgba(255,255,255,0.2)]"
        >
          <div className="flex items-center justify-center gap-3">
            {theme === "light" ? (
              <IoMoonOutline
                fontSize={23}
                className="text-[#91918e] dark:text-[#a3a3a3]"
              />
            ) : (
              <IoSunnyOutline
                fontSize={23}
                className="text-[#91918e] dark:text-[#a3a3a3]"
              />
            )}
            <h1 className=" dark:text-[#a3a3a3]">
              {theme === "light" ? "Dark" : "Light"}
            </h1>
          </div>
        </div>

        <div className="flex w-full px-3 py-4 h-10 rounded-md hover:bg-[rgba(0,0,0,0.06)] cursor-pointer dark:hover:bg-[rgba(255,255,255,0.2)]">
          <div className="flex items-center justify-center gap-3">
            <IoLogOutOutline
              fontSize={22}
              className="dark:text-[#a3a3a3] text-[#91918e]"
            />
            <h1 className=" dark:text-[#a3a3a3]">Logout</h1>
          </div>
        </div>
        <div className="flex w-full px-3 py-4 h-10 rounded-md hover:bg-[rgba(0,0,0,0.06)] cursor-pointer dark:hover:bg-[rgba(255,255,255,0.2)]">
          <div className="flex items-center justify-center gap-3">
            <IoSettingsOutline
              fontSize={22}
              className="dark:text-[#a3a3a3] text-[#91918e]"
            />
            <h1 className=" dark:text-[#a3a3a3]">Settings</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
