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
import { Tooltip } from "./ui/tooltip";
import useListState from "@/store/listState";
import { SortDescending } from "@phosphor-icons/react/dist/ssr";
import useList from "@/store/list";

interface ToolBarProps extends React.HTMLAttributes<HTMLDivElement> {
  onRefresh?: () => void;
  isRefreshing?: boolean;
  path: string;
}

const ToolBar: React.FC<ToolBarProps> = ({ className, onRefresh, isRefreshing, path, ...props }) => {
  const [UpDown, setUpDown] = useState(false);
  const { reverse: reverseObj, setReverse, setListMore } = useListState()
  const { clearList } = useList()

  const hasReverse = reverseObj[path] || false

  const [filter, setFilter] = useState("all")

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
          variant={"ghost"}
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

        <ToggleGroup
          type="single"
          defaultValue="all"
          className="bg-input dark:border-none m-auto"
          value={filter}
          onValueChange={(v) => {
            if (v) {
              setFilter(v)
            }
          }}
        >
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

        <Tooltip tip={hasReverse ? "Newest First" : "Older First"} className="h-[28px]">
          <Button
            variant={"ghost"}
            className={cn(
              "!py-1 !px-2 !h-[28px]",
              {
                "!bg-button-active": hasReverse
              }
            )}
            size={"toolsize"}
            onClick={() => {
              setReverse(path, !hasReverse)
              clearList(path)
              setListMore(path, true)
            }}
          >
            {hasReverse ?
              <SortAscending size={20} /> :
              <SortDescending size={20} />
            }
          </Button>
        </Tooltip>

      </div>
    </div>
  );
};

export default ToolBar;