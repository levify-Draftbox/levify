import EditorJS from "@editorjs/editorjs";
import { useEffect, useRef } from "react";
import List from "@editorjs/list";
import LinkTool from "@editorjs/link";
import RawTool from "@editorjs/raw";
import ImageTool from "@editorjs/image";
import Checklist from "@editorjs/checklist";
import Embed from "@editorjs/embed";
import Quote from "@editorjs/quote";
import Header from "@editorjs/header";

const Editer = () => {
  // const DEFAULT_INITIAL_DATA = {
  //   time: new Date().getTime(),
  //   blocks: [
  //     {
  //       type: "header",
  //       data: {
  //         text: "This is my awesome editor!",
  //         level: 1,
  //       },
  //     },
  //   ],
  // };

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
        header: {
          class: Header,
          config: {
            placeholder: "Untitled",
            defaultLevel: 1,
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
      data: {
        time: new Date().getTime(),
        blocks: [
          {
            type: "header",
            data: {
              // text: "Untitled",
              level: 1,
            },
          },
        ],
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
      <div className="heding" id="editorjs"></div>
    </>
  );
};

export default Editer;
