import { Button } from "../components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import useComposerStore from "@/store/composer";
import { useProfileStore } from "@/store/profile";
import { Calendar } from "../components/ui/calendar";
import React from "react";

const SideBar = () => {
  const { allSetting } = useProfileStore();
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const { newComposer } = useComposerStore();

  return (
    <div className="flex flex-col justify-between h-full dark:bg-transparent selection:select-none">
      <div className="p-2">
        <div className="w-full flex flex-col mt-1">
          <Link to="/inbox" className="cursor-pointer my-1 mx-2">
            <img
              className="w-full"
              alt="DraftBox Mail"
              src={
                allSetting?.appearance?.theme === "system"
                  ? !window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "  /logo-light.svg"
                    : "/logo-dark.svg"
                  : allSetting?.appearance?.theme === "light"
                  ? "/logo-light.svg"
                  : "/logo-dark.svg"
              }
            />
          </Link>

          <div className="mt-3">
            <Button onClick={() => newComposer()} variant={"primary"}>
              Create
            </Button>
          </div>

          <div className="flex-1 h-[500px] w-full my-4 p-1">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            onDayClick={(date) => {
              console.log("Day Clicked", date);
            
            }}
            className="rounded-md w-full h-full flex"
            classNames={{
              months:
                "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
              month: "space-y-4 w-full flex flex-col",
              table: "w-full h-full border-collapse space-y-1",
              head_row: "",
              row: "w-full mt-2 bg-transparent",
              // column: "h-full mt-2 bg-transparent",
              day: "text-xs w-7 h-7 rounded-sm",
            }}
          />
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
