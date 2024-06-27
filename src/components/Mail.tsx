import { Envelope, TrashSimple } from "@phosphor-icons/react";
import { Archive, Clock, Star } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

const Mail = () => {
  const [IsHovered, setIsHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full h-[50px] border-b-2 py-3 px-4 flex justify-between items-center hover:shadow-lg cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 border-2 rounded-md flex items-center justify-center">
          <p>R</p>
        </div>
        <Button variant={"star"} size={"toolsize"}>
          <Star size={15} />
        </Button>
        <p>Rellite</p>
        <p className="text-sm text-core bg-">official</p>
        <p className="ml-32 text-base">
          Discover all the features of your Rellite account
        </p>
      </div>
      <div>
        {IsHovered ? (
          <div className="flex">
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
  );
};

export default Mail;
