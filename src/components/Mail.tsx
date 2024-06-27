import { Star } from "lucide-react";

const Mail = () => {
  return (
    <div className="w-full h-[50px] border-b-2 py-3 px-4 flex justify-between items-center hover:shadow-lg">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 border-2 rounded-md flex items-center justify-center">
          <p>R</p>
        </div>
        <Star size={15}/>
        <p>Rellite</p>
        <p className="text-sm text-core bg-">official</p>
        <p className="ml-32 text-base">Discover all the features of your Rellite account</p>
      </div>
      <div>
        <p className="text-sm ">Yesterday</p>
      </div>
    </div>
  );
};

export default Mail;
