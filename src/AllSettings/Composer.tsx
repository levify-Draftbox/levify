import { SettingDiv, SettingTitle } from "./components";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import QuillEditor from "@/components/ui/Quill";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "@phosphor-icons/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";

const Composer = () => {
  const [content, setContent] = useState<string>("");
  const [notiEnable, setNotiEnable] = useState(false);
  const [isAddingSignature, setIsAddingSignature] = useState(false);
  const [signatureName, setSignatureName] = useState("");
  const [signatures, setSignatures] = useState<
    Array<{ name: string; content: string }>
  >([]);
  const [selectedSignature, setSelectedSignature] = useState<string | null>(
    null
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (value: string) => {
    setContent(value);
  };

  const handleAddSignature = () => {
    setIsAddingSignature(true);
    setSignatureName("");
    setContent("");
    setSelectedSignature(null);
  };

  const handleSave = () => {
    if (signatureName && content) {
      const newSignature = {
        name: signatureName,
        content: content,
      };

      let updatedSignatures;
      if (selectedSignature && selectedSignature !== signatureName) {
        updatedSignatures = signatures.map((sig) =>
          sig.name === selectedSignature ? newSignature : sig
        );
      } else {
        const existingIndex = signatures.findIndex(
          (sig) => sig.name === signatureName
        );
        if (existingIndex !== -1) {
          updatedSignatures = [...signatures];
          updatedSignatures[existingIndex] = newSignature;
        } else {
          updatedSignatures = [...signatures, newSignature];
        }
      }

      setSignatures(updatedSignatures);
      console.log("Saved Signature Data:", newSignature);
      setIsAddingSignature(false);
      setSelectedSignature(signatureName);
    } else {
      console.log("Please provide both a signature name and content");
    }
  };

  const handleSelectSignature = (name: string) => {
    setSelectedSignature(name);
    const signature = signatures.find((sig) => sig.name === name);
    if (signature) {
      setSignatureName(signature.name);
      setContent(signature.content);
    }
  };

  const handleDelete = () => {
    if (selectedSignature) {
      const updatedSignatures = signatures.filter(
        (sig) => sig.name !== selectedSignature
      );
      setSignatures(updatedSignatures);
      setSelectedSignature(null);
      setSignatureName("");
      setContent("");
    }
  };

  const handleRename = () => {
    if (selectedSignature) {
      setIsAddingSignature(true);
      setSignatureName(selectedSignature);
    }
  };

  useEffect(() => {
    if (isAddingSignature && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAddingSignature]);

  return (
    <div>
      <SettingDiv>
        <SettingTitle>Default Browser Composer</SettingTitle>
        <Button
          className="w-fit px-4"
          onClick={() => setNotiEnable(!notiEnable)}
          variant={!notiEnable ? "primary" : "secondary"}
        >
          {!notiEnable ? (
            <div className="flex gap-1 items-center">Enable</div>
          ) : (
            <div className="flex gap-1 items-center">Disable</div>
          )}
        </Button>
      </SettingDiv>

      <SettingDiv>
        <SettingTitle>Compose size</SettingTitle>
        <div className="flex gap-10 cursor-pointer">
          <div className="flex items-center space-x-2">
            <Switch id="airplane-mode" />
            <Label htmlFor="airplane-mode" className="font-normal">
              Compose full screen
            </Label>
          </div>
        </div>
      </SettingDiv>

      <SettingDiv className="!mb-16">
        <SettingTitle>Email Signature</SettingTitle>
        <div>
          <p className="text-sm">
            Edit and choose Signature that will be automatically added to your
            email message.
          </p>

          <motion.div className="py-3 cursor-pointer">
            <div
              className="flex gap-2 items-center text-core hover:text-core-lite"
              onClick={handleAddSignature}
            >
              <Plus size={20} />
              <h3>Add new signature</h3>
            </div>
          </motion.div>

          <div className="mt-2">
            <AnimatePresence mode="wait">
              {signatures.length > 0 && !isAddingSignature ? (
                <motion.div
                  key="select"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="flex gap-3"
                >
                  <Select
                    onValueChange={handleSelectSignature}
                    value={selectedSignature || undefined}
                  >
                    <SelectTrigger className="w-72">
                      <SelectValue placeholder="Select a signature" />
                    </SelectTrigger>
                    <SelectContent>
                      {signatures.map((sig, index) => (
                        <SelectItem key={index} value={sig.name}>
                          {sig.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Button variant={"secondary"} onClick={handleRename}>
                      Rename
                    </Button>
                    <Button variant={"secondary"} onClick={handleDelete}>
                      Delete
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="input"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Input
                    ref={inputRef}
                    className="w-full"
                    type="text"
                    placeholder="Edit signature name"
                    value={signatureName}
                    onChange={(e) => setSignatureName(e.target.value)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <motion.div
              className="mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <QuillEditor
                value={content}
                onChange={handleChange}
                placeholder="Start typing..."
              />
            </motion.div>
          </div>
        </div>
      </SettingDiv>

      <div className="mt-2 flex gap-3">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="w-28" variant={"primary"} onClick={handleSave}>
            Save
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="w-28" variant={"secondary"}>
            Discard
          </Button>
        </motion.div>
      </div>

      <SettingDiv>
        <SettingTitle>Reply</SettingTitle>
        <SettingDiv>
          <RadioGroup defaultValue="Reply-one">
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="Reply-one" id="Reply-one" />
              <Label htmlFor="Reply-one">Reply One</Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="Reply All" id="Reply All" />
              <Label htmlFor="Reply All">Reply All</Label>
            </div>
          </RadioGroup>
        </SettingDiv> 
      </SettingDiv>
    </div>
  );
};

export default Composer;
