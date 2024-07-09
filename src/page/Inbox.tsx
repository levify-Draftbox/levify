import Mail from "@/components/Mail";
import ToolBar from "@/components/ToolBar";

const Inbox = () => {
  return (
    <div className="w-full h-full">
      <ToolBar />
      <div className="bg-inbox-bg h-full">
        <Mail />
        <Mail />
        <Mail />
        <Mail />
      </div>
    </div>
  );
};

export default Inbox;
