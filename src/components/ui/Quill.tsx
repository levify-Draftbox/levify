import React, { lazy, Suspense } from "react";
import "react-quill/dist/quill.snow.css";
import "./quill-dark-mode.css";
import { Spinner } from "../Spinner";

const ReactQuill = lazy(() => import("react-quill"))

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const QuillEditor: React.FC<QuillEditorProps> = ({ value, onChange, placeholder }) => {
  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video"],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  return (
    <div className="quill-editor dark:text-white">
      <Suspense fallback={
        <div className="h-full w-full flex justify-center items-center">
          <Spinner />
        </div>
      }>
        <ReactQuill
          className="h-[10rem] dark:bg-gray-800"
          theme="snow"
          value={value}
          onChange={onChange}
          formats={[
            "header",
            "font",
            "size",
            "bold",
            "italic",
            "underline",
            "strike",
            "blockquote",
            "list",
            "bullet",
            "indent",
            "link",
            "image",
            "video",
          ]}
          placeholder={placeholder || "Write something amazing..."}
          modules={modules}
        />
      </Suspense>
    </div>
  );
};

export default QuillEditor;