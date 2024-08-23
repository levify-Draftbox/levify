import { useEffect, useState, useRef } from "react";
import { SettingDiv, SettingTitle } from "./components";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import QuillEditor from "@/components/ui/Quill";
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
import { useProfileStore } from "@/store/profile";
import { Spinner } from "@/components/Spinner";

const Composer = () => {
  const { allSetting, updateSettings } = useProfileStore();

  const [content, setContent] = useState<string>("");
  const [notiEnable, setNotiEnable] = useState(false);
  const [size, setSize] = useState(false);
  const [isAddingSignature, setIsAddingSignature] = useState(false);
  const [signatureName, setSignatureName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReply, setSelectedReply] = useState("replyOne");
  const [signatures, setSignatures] = useState<
    Array<{ name: string; content: string }>
  >([]);
  const [selectedSignature, setSelectedSignature] = useState<string | null>(
    null
  );

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (allSetting.compose) {
      const {
        useDefaultBrowserComposer,
        composerFullScreen,
        signature,
        replay,
      } = allSetting.compose;

      setNotiEnable(!!useDefaultBrowserComposer);
      setSize(composerFullScreen);
      setSignatures(signature || []);
      setSelectedReply(replay || "replyOne");
    }
  }, [allSetting]);

  interface ComposerSettings extends Record<string, unknown> {
    useDefaultBrowserComposer?: boolean;
    composerFullScreen?: boolean;
    signature?: { name: string; content: string }[];
    reply?: string;
  }

  const updateComposer = async (obj: ComposerSettings) => {
    setIsLoading(true);

    try {
      await updateSettings("compose", obj);
    } catch (error) {
      console.error("Error updating settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
      setIsAddingSignature(false);
      setSelectedSignature(signatureName);

      updateComposer({ signature: updatedSignatures });
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

      updateComposer({ signature: updatedSignatures });
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

  const handleBrowserComposer = () => {
    const newNotiEnable = !notiEnable;

    setNotiEnable(newNotiEnable);
    updateComposer({ useDefaultBrowserComposer: newNotiEnable });
  };

  const handleSize = () => {
    const newSize = !size;
    setSize(newSize);
    updateComposer({ composerFullScreen: newSize });
  };

  const handleReplyChange = (value: string) => {
    setSelectedReply(value);
    updateComposer({ replay: value });
  };

  return (
    <div>
      {isLoading && <Spinner className="absolute" />}
      <SettingDiv>
        <SettingTitle>Default Browser Composer</SettingTitle>
        <Button
          className="w-fit px-4"
          onClick={handleBrowserComposer}
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
            <Switch
              id="airplane-mode"
              checked={size}
              onCheckedChange={handleSize}
            />
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
        <motion.div>
          <Button
            className="w-28 hover:bg-core-lite"
            variant={"primary"}
            onClick={handleSave}
          >
            Save
          </Button>
        </motion.div>
        <motion.div>
          <Button className="w-28" variant={"secondary"}>
            Discard
          </Button>
        </motion.div>
      </div>

      <SettingDiv className="mt-10">
        <SettingTitle>Reply mode</SettingTitle>
        <RadioGroup
          value={selectedReply}
          onValueChange={handleReplyChange}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="replyOne" id="replyOne" />
            <Label htmlFor="replyOne">Reply to one</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="replyAll" id="replyAll" />
            <Label htmlFor="replyAll">Reply to all</Label>
          </div>
        </RadioGroup>
      </SettingDiv>
    </div>
  );
};

export default Composer;
