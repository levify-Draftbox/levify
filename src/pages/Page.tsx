import { IoDocumentTextOutline } from "react-icons/io5";
import { IoEllipsisHorizontal } from "react-icons/io5";
import { IoStarOutline } from "react-icons/io5";
import { IoTimeOutline } from "react-icons/io5";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

const Page = () => {
  return (
    <div className="flex justify-center items-center flex-col h-full">
      <div className="flex justify-between w-full h-11 p-1">
        <div className="flex items-center w-fit h-full gap-1 ml-1 rounded-sm p-2 hover:bg-[rgba(113,77,77,0.06)] cursor-pointer hover:dark:bg-[rgba(250,250,250,0.2)]">
          <IoDocumentTextOutline fontSize={20} className="" />
          <h1 className="">Document</h1>
        </div>
        <div className="flex items-center h-full gap-1 p-2">
          {/* <p>Edited at</p> */}
          <p className="cursor-pointer hover:bg-[rgba(0,0,0,0.06)] p-2 rounded-sm text-sm hover:dark:bg-[rgba(250,250,250,0.2)]">
            Share
          </p>
          <IoTimeOutline
            size={28}
            className="cursor-pointer hover:bg-[rgba(0,0,0,0.06)] p-1 rounded-sm hover:dark:bg-[rgba(250,250,250,0.2)]"
          />
          <IoStarOutline
            size={28}
            className="cursor-pointer hover:bg-[rgba(0,0,0,0.06)] p-1 rounded-sm hover:dark:bg-[rgba(250,250,250,0.2)]"
          />

          <DropdownMenu>
            <DropdownMenuTrigger>
              <IoEllipsisHorizontal
                size={30}
                className="cursor-pointer hover:bg-[rgba(0,0,0,0.06)] p-1 rounded-sm hover:dark:bg-[rgba(250,250,250,0.2)]"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="w-[50%] mt-20 h-full ">
        <Input className=" w-full font-bold h-auto text-4xl placeholder:text-[rgba(0,0,0,0.2)] dark:placeholder:text-[rgba(250,250,250,0.2)] border-none focus:!ring-0" placeholder="Untitled"/>
      </div>
    </div>
  );
};

export default Page;
