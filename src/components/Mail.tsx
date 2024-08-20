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

const Mail: React.FC<Partial<EmailObject>> = ({ b_subject, b_from, from_profile }) => {
  const [IsHovered, setIsHovered] = useState(false);

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="w-full h-[50px] border-b py-3 px-4 flex justify-between items-center hover:shadow-lg cursor-pointer"
        >
          <div className="flex flex-1 items-center gap-4">
            <div className="w-8 h-8 border overflow-hidden rounded-md flex items-center justify-center">
              <img src={from_profile} className="h-full w-full" />
            </div>

            <Button variant={"star"} size={"toolsize"}>
              <Star size={15} />
            </Button>
            <p className="w-[23%] overflow-hidden">{b_from}</p>
            <p className="ml-32 ">
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
              <p className="text-sm ">Yesterday</p>
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

export default Mail;
