import React, { useState } from "react";
import {
  ArrowClockwise,
  CaretDown,
  CaretUp,
  DotsThree,
  SortAscending,
} from "@phosphor-icons/react";
import { Button } from "./ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

interface ToolBarProps extends React.HTMLAttributes<HTMLDivElement> {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const ToolBar: React.FC<ToolBarProps> = ({ className, onRefresh, isRefreshing, ...props }) => {
  const [UpDown, setUpDown] = useState(false);

  return (
    <div
      className={cn(
        "min-h-[44px] h-[44px] w-full border-b flex items-center justify-between px-5 selection:select-none",
        className
      )}
      {...props}
    >
      <div className="flex gap-3 items-center">
        <Button
          variant={"toolbutton"}
          onClick={onRefresh}
          className="rounded-full"
          disabled={isRefreshing}
        >
          <ArrowClockwise size={16} className={isRefreshing ? "animate-spin" : ""} />
        </Button>
        <div className="flex items-center p-1 rounded-lg gap-1 hover:bg-[rgba(0,0,0,0.06)]">
          <Checkbox />
          <div
            onClick={() => {
              setUpDown(!UpDown);
            }}
          >
            {UpDown ? (
              <CaretUp weight="fill" size={12} />
            ) : (
              <CaretDown weight="fill" size={12} />
            )}
          </div>
        </div>
        <h2 className="font-semibold text-lg">Inbox</h2>
        <div className="py-1 px-1 rounded-md hover:bg-[rgba(0,0,0,0.07)] ">
          <DotsThree weight="bold" size={18} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ToggleGroup type="single" className="bg-input dark:border-none">
          <ToggleGroupItem size={"tooltip"} value="all" aria-label="Toggle bold">
            All
          </ToggleGroupItem>
          <ToggleGroupItem size={"tooltip"} value="read" aria-label="Toggle italic">
            Read
          </ToggleGroupItem>
          <ToggleGroupItem size={"tooltip"} value="unread" aria-label="Toggle underline">
            Unread
          </ToggleGroupItem>
          <ToggleGroupItem size={"tooltip"} value="file" aria-label="Toggle underline">
            Has file
          </ToggleGroupItem>
        </ToggleGroup>

        <Button
          variant={"toolbutton"}
          className="!py-1 !px-3"
          size={"toolsize"}
        >
          <SortAscending size={20} />
        </Button>
      </div>
    </div>
  );
};

export default ToolBar;