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
import { useProfileStore } from "@/store/profile";
import { Spinner } from "@/components/Spinner";

const Composer = () => {
  const { allSetting, updateSettings } = useProfileStore();

  const [content, setContent] = useState<string>("");
  const [DefaultComposer, setDefaultComposer] = useState(false);
  const [size, setSize] = useState(false);
  const [isAddingSignature, setIsAddingSignature] = useState(false);
  const [signatureName, setSignatureName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReply, setSelectedReply] = useState("replyOne");

  const [, setIsFirstLoad] = useState(true);
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

      setDefaultComposer(!!useDefaultBrowserComposer);
      setSize(composerFullScreen);
      setSignatures(signature || []);
      setSelectedReply(replay || "replyOne");

      // Set the first signature as the selected one when the component mounts
      if (signature && signature.length > 0) {
        setSelectedSignature(signature[0].name);
        setSignatureName(signature[0].name);
        setContent(signature[0].content);
      }
      setIsFirstLoad(false);
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

  const handleDiscard = () => {
    setSignatureName("");
    setContent("");
    setIsAddingSignature(false);

    if (selectedSignature) {
      const signature = signatures.find(
        (sig) => sig.name === selectedSignature
      );
      if (signature) {
        setSignatureName(signature.name);
        setContent(signature.content);
      }
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
    if (DefaultComposer) {
      localStorage.removeItem("composer");
    } else {
      localStorage.setItem("composer", "true");
    }
    if (!DefaultComposer) {
      if (typeof window !== "undefined" && navigator.registerProtocolHandler) {
        const currentOrigin = window.location.origin;
        const targetOrigin =
          window.location.hostname === "localhost"
            ? new URL("http://localhost:5173/composer").origin
            : new URL("https://dev.rellitel.ink/composer").origin;
  
        if (currentOrigin === targetOrigin) {
          navigator.registerProtocolHandler(
            "mailto",
            `${targetOrigin}/composer?to=%s`
          );
        } else {
          console.warn(
            "Origins do not match. Cannot register protocol handler."
          );
        }
      } else {
        console.warn(
          "registerProtocolHandler is not supported by this browser."
        );
      }
    }
    const newDefaultComposer = !DefaultComposer;
    setDefaultComposer(newDefaultComposer);
    updateComposer({ useDefaultBrowserComposer: newDefaultComposer });
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
      <SettingTitle>Default Browser Composer</SettingTitle>
      <SettingDiv>
        <Button
          className="w-fit px-4"
          onClick={handleBrowserComposer}
          variant={!DefaultComposer ? "primary" : "secondary"}
        >
          {!DefaultComposer ? (
            <div className="flex gap-1 items-center">Enable</div>
          ) : (
            <div className="flex gap-1 items-center">Disable</div>
          )}
        </Button>
      </SettingDiv>

      <SettingTitle>Composer size</SettingTitle>
      <SettingDiv>
        <div className="flex items-center w-full justify-between">
          <p className="text-xs text-[rgba(0,0,0,0.5)] dark:text-[rgba(255,255,255,0.5)]">
            Composer full screen
          </p>
          <Switch
            id="airplane-mode"
            checked={size}
            onCheckedChange={handleSize}
          />
        </div>
      </SettingDiv>

      <SettingTitle>Email Signature</SettingTitle>
      <SettingDiv className="!mb-0">
        <div>
          <p className="text-sm">
            Edit and choose Signature that will be automatically added to your
            email message.
          </p>

          <div className="py-3 cursor-pointer">
            <div
              className="flex gap-2 items-center text-core hover:text-core-lite"
              onClick={handleAddSignature}
            >
              <Plus size={20} />
              <h3>Add new signature</h3>
            </div>
          </div>

          <div className="mt-2">
            <div className="mb-3">
              {!isAddingSignature ? (
                <div className="flex gap-3">
                  {signatures.length > 0 && (
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
                  )}
                  <div className="flex gap-2">
                    {selectedSignature && (
                      <>
                        <Button variant={"secondary"} onClick={handleRename}>
                          Edit
                        </Button>
                        <Button variant={"secondary"} onClick={handleDelete}>
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div key="input">
                  <Input
                    ref={inputRef}
                    className="w-full"
                    type="text"
                    placeholder="Edit signature name"
                    value={signatureName}
                    onChange={(e) => setSignatureName(e.target.value)}
                  />
                </div>
              )}
            </div>

            {isAddingSignature && (
              <QuillEditor
                value={content}
                onChange={handleChange}
                placeholder="Start typing..."
              />
            )}
          </div>
        </div>
      </SettingDiv>

      {isAddingSignature && (
        <SettingDiv>
          <div className="mt-16"></div>
        </SettingDiv>
      )}
      <SettingDiv className="mt-2 flex gap-3">
        {isAddingSignature && (
          <>
            <Button
              className="w-28 hover:bg-core-lite"
              variant={"primary"}
              onClick={handleSave}
            >
              Save
            </Button>
            <Button
              className="w-28"
              variant={"secondary"}
              onClick={handleDiscard}
            >
              Discard
            </Button>
          </>
        )}
      </SettingDiv>

      <SettingTitle>Reply mode</SettingTitle>
      <SettingDiv className="mt-10">
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
