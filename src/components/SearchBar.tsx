import { Gear, MagnifyingGlass } from "@phosphor-icons/react";
import { Button } from "./ui/button";

type SearchBarProp = {
  onSettingToggle: () => void
}

const SearchBar = ({ onSettingToggle }: SearchBarProp) => {
  return (
    <div className="w-full h-[52px] border-b">
      <div className="flex h-full items-center justify-between px-3 py-[10px]">
        <div className="flex bg-[rgba(0,0,0,0.06)] h-full items-center px-3 rounded-lg">
          <MagnifyingGlass size={18} />
          <input
            className="bg-transparent w-96 p-2 outline-none"
            src="text"
            placeholder="Search Message"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant={"toolbutton"} className="" onClick={() => onSettingToggle()}>
            <Gear size={20} />
          </Button>
          <div className="w-9 h-9 border-2 cursor-pointer rounded-lg flex items-center justify-center hover:bg-[rgba(0,0,0,0.07)] dark:hover:bg-[rgba(250,250,250,0.2)]">
            <p>R</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
