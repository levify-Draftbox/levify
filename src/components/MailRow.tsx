import { Envelope, TrashSimple } from "@phosphor-icons/react";
import { Archive, Clock, Star } from "lucide-react";
import { Button } from "./ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { EmailObject } from "@/page/Inbox";
import moment from "moment"
import { cn } from "@/lib/utils";

const Mail: React.FC<Partial<{
  onClick: () => void
} & EmailObject>> = ({ onClick, b_subject, b_from, from_profile, b_datetime, unread, b_from_name, b_text }) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          onClick={() => onClick && onClick()}
          className={cn(
            "group",
            "w-full h-[50px] border-b py-3 px-4 flex justify-between items-center cursor-pointer text-[15px] font-thin",
            unread ? "font-medium" : ""
          )}
        >
          <div className="w-[75%] flex flex-1 items-center gap-4">
            <div className="min-w-7 w-7 h-7 border overflow-hidden rounded-md flex items-center justify-center">
              <img src={from_profile} className="h-full w-full" />
            </div>

            <Button className="" variant={"star"} size={"toolsize"}>
              <Star size={15} />
            </Button>
            <div className="min-w-[130px] w-[18%]">
            <p className="w-full overflow-hidden">{getUserName(b_from_name, b_from as string)}</p>
            </div>
            <p className="max-w-[60%] font-thin flex items-center whitespace-nowrap overflow-hidden">
              {unread && <div className="w-[10px] h-[10px] bg-core rounded-full mr-3"></div>}
              {b_subject ? b_subject : <span className="text-gray-500 dark:text-gray-400 italic">No Subject</span>}
              {(b_text && b_text != "") && <span className="text-gray-500 dark:text-gray-300 overflow-hidden text-ellipsis">&nbsp;- {b_text.split("\n")[0].split(" ").splice(0, 7).join(" ")}...</span>}
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
            <p className="text-sm font-thin group-hover:hidden">
              {moment(new Date(b_datetime || "")).fromNow()}
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


export default Mail;
