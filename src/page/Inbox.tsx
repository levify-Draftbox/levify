import Mail from "@/components/Mail";
import ToolBar from "@/components/ToolBar";
import ScrollArea from "@/components/ui/ScrollArea";

const Inbox = () => {
  return (
    <div className="w-full flex flex-col flex-1 overflow-hidden">
      <ToolBar className={""} />
      <div className="bg-inbox-bg overflow-hidden flex-1">
        <ScrollArea>
          {Array.from({ length: 100 }, (_, i) => i + 1).map(i => {
            return <Mail key={i} />
          })}
          Hello
        </ScrollArea>
      </div>
    </div>
  );
};

export default Inbox;
