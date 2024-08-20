import { Envelope, TrashSimple } from "@phosphor-icons/react";
import { Archive, Clock, Star } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
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
} & EmailObject>> = ({ onClick, b_subject, b_from, from_profile, b_datetime, unread, b_from_name }) => {
  const [IsHovered, setIsHovered] = useState(false);

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          onClick={() => onClick && onClick()}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={cn(
            "w-full h-[50px] border-b py-3 px-4 flex justify-between items-center hover:shadow-lg cursor-pointer text-[15px] font-thin",
            unread ? "font-medium" : ""
          )}
        >
          <div className="flex flex-1 items-center gap-4">
            <div className="w-7 h-7 border overflow-hidden rounded-md flex items-center justify-center">
              <img src={from_profile} className="h-full w-full" />
            </div>

            <Button variant={"star"} size={"toolsize"}>
              <Star size={15} />
            </Button>
            <p className="w-[18%] overflow-hidden">{getUserName(b_from_name, b_from as string)}</p>
            <p className="font-thin">
              {b_subject}
            </p>
          </div>
          <div className="w-[10%] text-right">
            {IsHovered ? (
              <div className="flex justify-end">
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
            ) : (
              <p className="text-sm font-thin">
                {moment(new Date(b_datetime || "")).fromNow()}
              </p>
            )}
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
