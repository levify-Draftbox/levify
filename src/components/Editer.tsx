import EditorJS, { EditorConfig } from "@editorjs/editorjs";
import { useEffect, useRef } from "react";
import edjsHTML from "editorjs-html";

const Editor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<EditorJS | null>(null);

  const edjsParser = edjsHTML();
  useEffect(() => {
    if (editorRef.current && !editorInstanceRef.current) {
      const editorConfig: EditorConfig = {
        holder: editorRef.current,
        autofocus: true,
        onChange: async () => {
          const content = await editorInstanceRef.current?.save();

          if (content) {
            const html = edjsParser.parse(content);
            console.log(html);
          }
        },
        tools: {
          // We'll leave this empty for now
        },
        data: {
          time: new Date().getTime(),
          blocks: [
            {
              type: "paragraph",
              data: {
                text: "Start writing here...",
              },
            },
          ],
        },
      };

      const editor = new EditorJS(editorConfig);

      editor.isReady
        .then(() => {
          editorInstanceRef.current = editor;
        })
        .catch((error: Error) => {
          console.error("Editor.js initialization failed:", error);
        });
    }

    return () => {
      const editor = editorInstanceRef.current;
      if (editor && typeof editor.destroy === "function") {
        try {
          editor.destroy();
        } catch (e) {
          console.error("Error destroying editor:", e);
        }
      }
    };
  }, []);

  return <div ref={editorRef} className="editor"></div>;
};

export default Editor;
