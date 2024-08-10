import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useState } from "react";

export default function App() {
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
    uploadFile: handleUpload
  });

  const onChange = async () => {
    const html = await editor.blocksToHTMLLossy(editor.document);
    setHTML(html);
  };

  return (
    <div className="wrapper">
      <div>Input (BlockNote Editor):</div>
      <div className="item">
        <BlockNoteView editor={editor} onChange={onChange} />
      </div>
      <div>Output (HTML):</div>
      <div className="item bordered ">
        <pre>
          <code>{html}</code>
        </pre>
      </div>
    </div>
  );
}