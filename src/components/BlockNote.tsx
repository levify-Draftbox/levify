import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

function Blocknote() {
  const editor = useCreateBlockNote();

  return (
  <div className="w-full h-full">

      <BlockNoteView editor={editor} theme={"light"}/>
  </div>
  );
}

export default Blocknote;