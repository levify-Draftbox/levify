import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./quill-dark-mode.css";

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
    </div>
  );
};

export default QuillEditor;