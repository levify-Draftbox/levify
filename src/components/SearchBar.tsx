import { Bell, Gear, MagnifyingGlass } from "@phosphor-icons/react";
import { Button } from "./ui/button";
import { Tooltip } from "./ui/tooltip";

type SearchBarProp = {
  onSettingToggle: () => void
}

const SearchBar = ({ onSettingToggle }: SearchBarProp) => {
  return (
    <div className="flex justify-between w-full h-[52px] border-b">
      <div></div>
      <div className="flex h-full items-center justify-between px-3 py-[10px] gap-2">
        <div className="flex bg-input border border-input-border  h-full items-center px-3 rounded-lg w-[350px]">
          <MagnifyingGlass size={16} />
          <input
            className="bg-transparent w-96 p-2 outline-none text-sm"
            src="text"
            placeholder="Search Message"
          />
        </div>
        <div className="flex items-center gap-2">

          <Tooltip tip="Notification">
            <Button variant={"toolbutton"} className="" onClick={() => onSettingToggle()}>
              <Bell size={20} />
            </Button>
          </Tooltip>

          <Tooltip tip="Settings">
            <Button variant={"toolbutton"} className="" onClick={() => onSettingToggle()}>
              <Gear size={20} />
            </Button>
          </Tooltip>

          <Tooltip tip="Your Profile">
            <div className="w-9 h-9 border-2 cursor-pointer rounded-lg flex items-center justify-center hover:bg-[rgba(0,0,0,0.07)] dark:hover:bg-[rgba(250,250,250,0.2)]">
              <p>R</p>
            </div>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
