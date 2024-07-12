import { X } from "@phosphor-icons/react";
import { FC } from "react";
import ReactDOM from "react-dom";
import { Button } from "./ui/button";

type ModalProps = {
  onClose: () => void;
};

const Model: FC<ModalProps> = ({ onClose }) => {
  const portalRoot = document.querySelector(".reactPortal");

  if (!portalRoot) {
    throw new Error(
      "The element with class .reactPortal was not found in the document."
    );
  }

  const handleCloseModal = () => {
    onClose();
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-[80%] h-[80%] rounded-lg p-4">
        <div className="flex justify-between">
          <h1>Modal</h1>
          <Button variant="toolbutton" onClick={handleCloseModal}>
            <X size={20} />
          </Button>
        </div>
      </div>
    </div>,
    portalRoot
  );
};

export default Model;
