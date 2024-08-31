import React from 'react';
import { Envelope, TrashSimple } from "@phosphor-icons/react";
import { Archive, Clock, Star } from "lucide-react";
import { Button } from "./ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import moment from "moment"
import { cn } from "@/lib/utils";
import { processEmailSubject } from '@/page/Inbox';

export type FromName = {
  name?: string,
  email: string,
  profile: string,
}

interface MailRowProps {
  onClick?: () => void;
  className?: string;

  datetime: string,
  text: string,
  unread: boolean;
  count: number;
  fromNames: FromName[]
  subject: string
}

const MailRow: React.FC<MailRowProps> = ({
  onClick,
  className,

  datetime,
  text,
  unread,
  count,
  fromNames,
  subject
}) => {

  const filterdFromName = removeDuplicateFromName(fromNames)

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          onClick={() => onClick && onClick()}
          className={cn(
            "group",
            "w-full h-[50px] border-b py-1 px-4 flex justify-between items-center cursor-pointer text-[15px] font-[350]",
            unread ? "font-[450] text-[#302a28]  dark:text-white bg-[rgba(0,0,0,0.025)] hover:!bg-[rgba(0,0,0,0.04)] dark:!bg-[rgba(255,255,255,0.015)] dark:hover:!bg-[rgba(255,255,255,0.06)]" : "text-gray-700/90 dark:text-gray-300",
            className
          )}
        >
          <div className="w-[75%] flex flex-1 items-center gap-4">
            <div className="min-w-7 w-7 h-7 border overflow-hidden rounded-md flex items-center justify-center">
              <img src={fromNames[0].profile} className="h-full w-full" alt="Profile" />
            </div>

            <Button className="" variant={"star"} size={"toolsize"}>
              <Star size={15} />
            </Button>
            <div className="min-w-[130px] w-[18%]">
              <p className="w-full overflow-hidden">
                <span title={filterdFromName[0].email}>
                  {getUserName(filterdFromName[0].name, filterdFromName[0].email)}
                </span>

                {filterdFromName.length > 1 &&
                  <>,&nbsp;
                    <span title={filterdFromName[1].email}>
                      {getUserName(filterdFromName[1].name, filterdFromName[1].email)}
                    </span>
                  </>
                }

                {count > 1 && <span className='text-sm ml-1 !text-[13px] text-gray-400 dark:text-gray-300'> {count}</span>}
              </p>
            </div>
            <p className="max-w-[60%] flex items-center whitespace-nowrap overflow-hidden">
              {unread && <div className="min-w-[10px] h-[10px] bg-core rounded-full mr-3"></div>}
              {subject ?
                (() => {
                  const sub = processEmailSubject(subject)
                  return <div className='flex gap-2'>
                    {sub.tags?.map(s => <span className='bg-button-hover px-1 rounded-sm'>{s}</span>)}
                    {sub.cleanSubject}
                  </div>
                })()
                : <span className="text-gray-500 dark:text-gray-400 italic">No Subject</span>}
              {(count == 1 && text && text != "") && <span className="text-gray-500 dark:text-gray-300/70 overflow-hidden text-ellipsis">&nbsp;- {text.split("\n")[0].split(" ").splice(0, 7).join(" ")}...</span>}
            </p>
          </div>

          <div className="w-[20%] text-right">
            <div className="hidden justify-end group-hover:flex">
              <Button variant={"toolbutton"}>
                <Envelope size={17} />
              </Button>
              <Button variant={"toolbutton"}>
                <TrashSimple weight="bold" size={17} />
              </Button>
              <Button variant={"toolbutton"}>
                <Archive size={17} />
              </Button>
              <Button variant={"toolbutton"}>
                <Clock size={17} />
              </Button>
            </div>
            <p className="text-sm font-[350] group-hover:hidden">
              {moment(new Date(datetime || "")).fromNow()}
            </p>
          </div>
        </div>
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem>Profile</ContextMenuItem>
        <ContextMenuItem>Billing</ContextMenuItem>
        <ContextMenuItem>Team</ContextMenuItem>
        <ContextMenuItem>Subscription</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

function getUserName(fromName: string | undefined, fromEmail: string): string {
  if (fromName) return fromName
  return fromEmail.split("@")[0]
}

function removeDuplicateFromName(array: FromName[]): FromName[] {
  const emailSet = new Set<string>();

  return array.filter(item => {
    if (emailSet.has(item.email)) {
      return false;  // This email has been seen before, so filter it out
    } else {
      emailSet.add(item.email);  // Add this email to the set
      return true;  // Keep this item in the array
    }
  });
}

export default MailRow;