import React from "react";
import {
  SortAscending,
} from "@phosphor-icons/react";
import { Button } from "./ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Tooltip } from "./ui/tooltip";
import useListState, { ListCategoryType } from "@/store/listState";
import { SortDescending } from "@phosphor-icons/react/dist/ssr";
import useList from "@/store/list";

const nameOfBox: { [path: string]: string } = {
  inbox: "Inbox",
  sent: "Sent",
  spam: "Spam",
  all: "All Mails"
}

const otherName: { [path: string]: string } = {
  draft: "Dummy"
}

interface ToolBarProps extends React.HTMLAttributes<HTMLDivElement> {
  onRefresh?: () => void;
  isRefreshing?: boolean;
  path: string;
}

const ToolBar: React.FC<ToolBarProps> = ({ className, onRefresh, isRefreshing, path, ...props }) => {
  const { reverse: reverseObj, setReverse, setListMore, listCategory: listCategoryObj, setListCategory } = useListState()
  const { clearList } = useList()
  const hasReverse = reverseObj[path] || false
  const { unreadCount } = useListState()
  const unreadMsgs = unreadCount[path] || 0
  const listCategory = listCategoryObj[path] || "all"

  return (
    <div
      className={cn(
        "min-h-[44px] h-[44px] w-full border-b flex items-center justify-between px-5 selection:select-none",
        className
      )}
      {...props}
    >
      <div className="flex gap-3 items-center">
        <div className="flex items-center p-1 rounded-lg gap-1 hover:bg-[rgba(0,0,0,0.06)]">
          <Checkbox />
        </div>
        <h2 className="text-md">
          {nameOfBox[path] || otherName[path] || "Other"}
        </h2>
        {unreadMsgs ?
          <h2>
            <Tooltip tip={`${unreadMsgs} Unread Messages`} className="h-[20px] pt-[2px]">
              <span className="text-core font-semibold cursor-pointer"
                onClick={() => {
                  setListCategory(path, "unread")
                  clearList(path)
                  setListMore(path, true)
                }}
              >{unreadMsgs}</span>
            </Tooltip>
          </h2>
          : <></>
        }
      </div>

      <div className="flex items-center gap-2">

        <ToggleGroup
          type="single"
          defaultValue="all"
          className="bg-input dark:border-none m-auto"
          value={listCategory}
          onValueChange={(v) => {
            if (v) {
              setListCategory(path, v as ListCategoryType)
              clearList(path)
              setListMore(path, true)
            }
          }}
        >
          <ToggleGroupItem size={"tooltip"} value="all" aria-label="Toggle bold">
            All
          </ToggleGroupItem>
          <ToggleGroupItem size={"tooltip"} value="unread" aria-label="Toggle underline">
            Unread
          </ToggleGroupItem>
          <ToggleGroupItem size={"tooltip"} value="read" aria-label="Toggle italic">
            Read
          </ToggleGroupItem>
          <ToggleGroupItem size={"tooltip"} value="file" aria-label="Toggle underline">
            Has File
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