// import EditorJS, { EditorConfig } from "@editorjs/editorjs";
// import { useEffect, useRef } from "react";
// import Header from "@editorjs/header";
// import LinkTool from "@editorjs/link";
// import RawTool from "@editorjs/raw";
// import ImageTool from "@editorjs/image";
// import Checklist from "@editorjs/checklist";
// import List from "@editorjs/list";
// import Embed from "@editorjs/embed";
// import Quote from "@editorjs/quote";
// import Table from '@editorjs/table'


// import edjsParser from "editorjs-parser";

// const config = {};
// const customParsers = {};
// const embedMarkup = {};

// const parser = new edjsParser(config, customParsers, embedMarkup);

// const Editor: React.FC = () => {
//   const editorRef = useRef<HTMLDivElement>(null);
//   const editorInstanceRef = useRef<EditorJS | null>(null);

//   useEffect(() => {
//     if (editorRef.current && !editorInstanceRef.current) {
//       const editorConfig: EditorConfig = {
//         holder: editorRef.current,
//         autofocus: true,
//         onChange: async () => {
//           const content = await editorInstanceRef.current?.save();

//           if (content) {
//             const markup = parser.parse(content);
//             console.log(markup);
            
//           }
//         },
//         tools: {
//           header: Header,
//           linkTool: LinkTool,
//           raw: RawTool,
//           table: Table,
//           image: {
//             class: ImageTool,
//             config: {
//               endpoints: {
//                 byFile: "http://localhost:8008/uploadFile",
//                 byUrl: "http://localhost:8008/fetchUrl",
//               },
//             },
//           },
//           checklist: {
//             class: Checklist,
//             inlineToolbar: true,
//           },
//           list: {
//             class: List,
//             inlineToolbar: true,
//             config: {
//               defaultStyle: "unordered",
//             },
//           },
//           embed: Embed,
//           quote: Quote,
//         },

//         data: {
//           time: new Date().getTime(),
//           blocks: [
//             {
//               type: "paragraph",
//               data: {
//                 text: "Start writing here...",
//               },
//             },
//           ],
//         },
//       };

//       const editor = new EditorJS(editorConfig);

//       editor.isReady
//         .then(() => {
//           editorInstanceRef.current = editor;
//         })
//         .catch((error: Error) => {
//           console.error("Editor.js initialization failed:", error);
//         });
//     }

//     return () => {
//       const editor = editorInstanceRef.current;
//       if (editor && typeof editor.destroy === "function") {
//         try {
//           editor.destroy();
//         } catch (e) {
//           console.error("Error destroying editor:", e);
//         }
//       }
//     };
//   }, []);

//   return (
//     <div className="w-full h-full">
//       <div ref={editorRef} className="editor"></div>
//     </div>
//   );
// };

// export default Editor;
