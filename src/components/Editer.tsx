import EditorJS, { EditorConfig } from "@editorjs/editorjs";
import { useEffect, useRef } from "react";
import edjsHTML from "editorjs-html";
import Header from '@editorjs/header';
import LinkTool from '@editorjs/link';
import RawTool from '@editorjs/raw';
import ImageTool from '@editorjs/image';
import Checklist from '@editorjs/checklist'
import List from "@editorjs/list";
import Embed from '@editorjs/embed';
import Quote from '@editorjs/quote';


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
          header: Header,
          linkTool: LinkTool,
          raw: RawTool,
          image: {
            class: ImageTool,
            config: {
              endpoints: {
                byFile: 'http://localhost:8008/uploadFile',
                byUrl: 'http://localhost:8008/fetchUrl',
              },
            },
          },
          checklist: {
            class: Checklist,
            inlineToolbar: true,
          },
          list: {
            class: List,
            inlineToolbar: true,
            config: {
              defaultStyle: 'unordered',
            },
          },
          embed: Embed,
          quote: Quote,
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
