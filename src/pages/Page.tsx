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
import { motion } from "framer-motion";
import { useState } from "react";
import { IoImage } from "react-icons/io5";
import { IoChatboxEllipses } from "react-icons/io5";
import Editer from "@/components/Editer";

const Page = () => {
  const [isHovered, setIsHovered] = useState(false);
  // const [isImgHovered, setIsImgHovered] = useState(false);

  const [Isimage, setIsimage] = useState(false);
  // console.log(Isimage);

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

      {Isimage && (
        <div
          className="w-full h-72"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="absolute right-60 mt-2"
            >
              <div className="flex gap-0 bg-white dark:bg-black text-sm rounded-md">
                <div className="flex cursor-pointer dark:text-[rgba(250,250,250,0.6)] text-[rgba(0,0,0,0.4)] hover:bg-[rgba(0,0,0,0.07)] dark:hover:bg-[rgba(250,250,250,0.15)] px-2 py-1 w-fit gap-2 items-center">
                  <p>Chenge Cover</p>
                </div>
                <div className="border-[1px] dark:border-[rgba(250,250,250,0.3)]"></div>
                <div className="flex cursor-pointer dark:text-[rgba(250,250,250,0.6)] text-[rgba(0,0,0,0.4)] hover:bg-[rgba(0,0,0,0.07)] dark:hover:bg-[rgba(250,250,250,0.15)] px-2 py-1  w-fit gap-2 items-center">
                  <p>Reposition</p>
                </div>
              </div>
            </motion.div>
          )}

          <img className="w-full h-72 object-cover" src="/unnamed.png" />
        </div>
      )}

      <motion.div className="w-[50%] h-full">
        <motion.div
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className=" pt-20"
        >
          <motion.div className="relative">
            {isHovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute mt-[-30px]"
              >
                <div className="flex gap-0">
                  {Isimage ? (
                    ""
                  ) : (
                    <div
                      onClick={() => setIsimage(!Isimage)}
                      className="flex ml-2 cursor-pointer dark:text-[rgba(250,250,250,0.35)] text-[rgba(0,0,0,0.4)] hover:bg-[rgba(0,0,0,0.07)] dark:hover:bg-[rgba(250,250,250,0.15)] px-2 py-1 rounded-md w-fit gap-2 items-center"
                    >
                      <IoImage />
                      <p>Add Cover</p>
                    </div>
                  )}

                  <div className="flex cursor-pointer dark:text-[rgba(250,250,250,0.35)] text-[rgba(0,0,0,0.4)] hover:bg-[rgba(0,0,0,0.07)] dark:hover:bg-[rgba(250,250,250,0.15)] px-2 py-1 rounded-md w-fit gap-2 items-center">
                    <IoChatboxEllipses />
                    <p>Add Comment</p>
                  </div>
                </div>
              </motion.div>
            )}

            <Input
              className="w-full font-bold h-auto text-4xl rounded-none placeholder:text-[rgba(0,0,0,0.2)] dark:placeholder:text-[rgba(250,250,250,0.2)] border-none focus:!ring-0"
              placeholder="Untitled"
            />
            <div>
             <Editer/>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Page;
