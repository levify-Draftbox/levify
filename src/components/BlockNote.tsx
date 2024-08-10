import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import { useState } from "react";
 
// import "./styles.css";
 
export default function App() {
  const [html, setHTML] = useState<string>("");
 
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
 