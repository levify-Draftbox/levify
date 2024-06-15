import { IoDocumentTextOutline } from "react-icons/io5";
import { IoEllipsisHorizontal } from "react-icons/io5";
import { IoStarOutline } from "react-icons/io5";
import { IoTimeOutline } from "react-icons/io5";

const Page = () => {
  return (
    <div className="flex justify-center items-center flex-col h-full">
      <div className="flex justify-between w-full h-11 p-1">
        <div className="flex items-center w-fit h-full gap-1 rounded-sm p-2 hover:bg-[rgba(0,0,0,0.06)] cursor-pointer">
          <IoDocumentTextOutline fontSize={20} className="" />
          <h1 className="">Document</h1>
        </div>
        <div className="flex items-center h-full gap-1 p-2">
          {/* <p>Edited at</p> */}
          <p className="cursor-pointer hover:bg-[rgba(0,0,0,0.06)] p-2 rounded-sm text-sm">Share</p>
          <IoTimeOutline size={28} className="cursor-pointer hover:bg-[rgba(0,0,0,0.06)] p-1 rounded-sm"/>
          <IoStarOutline size={28} className="cursor-pointer hover:bg-[rgba(0,0,0,0.06)] p-1 rounded-sm"/>
          <IoEllipsisHorizontal size={30} className="cursor-pointer hover:bg-[rgba(0,0,0,0.06)] p-1 rounded-sm"/>
        </div>
      </div>
      <div className="flex w-full items-center justify-center h-full">
        <h1 className="text-2xl">Hello, This is doc!</h1>
      </div>
    </div>
  );
};

export default Page;
