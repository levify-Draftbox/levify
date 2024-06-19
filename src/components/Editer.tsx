import EditorJS from "@editorjs/editorjs";
import { useEffect, useRef } from "react";
import List from "@editorjs/list";
import Header from "@editorjs/header";
import LinkTool from "@editorjs/link";
import RawTool from "@editorjs/raw";
import ImageTool from "@editorjs/image";
import Checklist from "@editorjs/checklist";
import Embed from "@editorjs/embed";
import Quote from "@editorjs/quote";

const Editer = () => {
  const ejInstance = useRef();

  const initEditor = () => {
    const editor = new EditorJS({
      holder: "editorjs",
      autofocus: true,
      onChange: async () => {
        const content = await editor.save();
        console.log(content);
      },
      tools: {
        Header: {
          class: Header,
          config: {
            placeholder: "Enter a header",
            levels: [2, 3, 4],
            defaultLevel: 3,
          },
        },
        List,
        LinkTool,
        RawTool,
        ImageTool,
        Checklist,
        Embed,
        Quote,
      },
    });
  };

  useEffect(() => {
    if (ejInstance.current === null) {
      initEditor();
    }

    return () => {
      ejInstance?.current?.destroy();
      ejInstance.current = null;
    };
  }, []);

  return (
    <>
      <div className="" id="editorjs"></div>
    </>
  );
};

export default Editer;
