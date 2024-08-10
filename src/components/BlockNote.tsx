import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useState } from "react";

export default function Blocknote() {
  const [html, setHTML] = useState<string>("");

  const handleUpload = async (file: File) => {
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    });
  };

  const editor = useCreateBlockNote({
    initialContent: [
      {
        type: "paragraph",
        content: [
          "Hello, ",
          {
            type: "text",
            text: "world!",
            styles: {
              bold: true,
            },
          },
        ],
      },
    ],
    uploadFile: handleUpload,
  });

  const onChange = async () => {
    const html = await editor.blocksToHTMLLossy(editor.document);
    setHTML(html);
  };

  console.log(html);
  

  return (
    <div className="">
        <BlockNoteView editor={editor} onChange={onChange}  theme={"light"}/>
    </div>
  );
}
