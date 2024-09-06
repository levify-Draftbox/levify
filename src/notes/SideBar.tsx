import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { useProfileStore } from "@/store/profile";
import { CaretDown, CaretRight, House, Tray, Plus } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const SideBar = () => {
  const { allSetting } = useProfileStore();

  const [showPrivate, setShowPrivate] = useState(false);

  return (
    <div className="flex flex-col justify-between h-full dark:bg-transparent selection:select-none">
      <div className="p-2">
        <div className="w-full flex flex-col mt-1">
          <Link to="/inbox" className="cursor-pointer mx-2">
            <img
              className="max-h-[28px]"
              alt="DraftBox Mail"
              src={
                allSetting?.appearance?.theme === "system"
                  ? !window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "/logo-light.svg"
                    : "/logo-dark.svg"
                  : allSetting?.appearance?.theme === "light"
                    ? "/logo-light.svg"
                    : "/logo-dark.svg"
              }
            />
          </Link>

          <div className="mt-3">
            <Button
              variant={"primary"}
              size={"sm"}
            >
              New Note
            </Button>

          </div>

          <div className="mt-3 flex flex-col gap-1">
            <SidebarNavLink icon={<House size={18} />} to="/notes/home">
              Home
            </SidebarNavLink>

            <SidebarNavLink icon={<Tray size={18} />} to="/notes/inbox">
              Inbox
            </SidebarNavLink>

            {/* New Private section */}
            <div
              onClick={() => setShowPrivate(!showPrivate)}
              className="py-[6px] px-3 mt-2 w-full rounded-lg hover:bg-[rgba(0,0,0,0.07)] cursor-pointer"
            >
              <div className="flex items-center gap-2">
                {showPrivate ? <CaretDown size={10} /> : <CaretRight size={10} />}
                <p className="text-sm">Private</p>
              </div>
            </div>

            {showPrivate && (
              <div className=" mt-1">
                <SidebarNavLink icon={<Plus size={16} />} to="/notes/add-page">
                  Add page
                </SidebarNavLink>
                {/* Add more private items here if needed */}
              </div>
            )}
          </div>



          <div>

          </div>

        </div>
      </div>

      <div className="w-full flex flex-col p-1 pb-4">
        <div className="w-full pt-3 px-1">
          <Progress value={10} />
          <div className="text-xs flex justify-between  mt-2">
            <div className="flex">
              <span className="font-semibold">200 MB </span>
              <p>/ 2.0 GB</p>
            </div>
            <p>1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideBar;



type SidebarNavLinkProp = {
  icon: React.ReactNode;
  children: React.ReactNode;
  to?: string;
  unread?: number;
};
function SidebarNavLink(p: SidebarNavLinkProp) {
  return (
    <Button variant={"navlink"} to={p.to || "/"}>
      <div className="flex gap-2">
        {p.icon}
        <p className="text-sm">{p.children}</p>
      </div>
      <div>
        <div className=" flex justify-center gap-2 items-center">
          {p.unread && p.unread > 0 && (
            <p className="text-white text-sm px-[10px] bg-core rounded-full py-[1px] !font-bold">
              {p.unread}
            </p>
          )}
        </div>
      </div>
    </Button>
  );
}