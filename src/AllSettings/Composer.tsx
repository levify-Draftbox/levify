import { SettingDiv, SettingTitle } from "./components";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import QuillEditor from "@/components/ui/Quill";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Composer = () => {
  const [content, setContent] = useState<string>("");
  const [notiEnable, setNotiEnable] = useState(false);

  const handleChange = (value: string) => {
    setContent(value);
  };

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
          <div className="mt-2">
            <Input type="text" placeholder="Edit signature name" />
            <div className="mt-2">
              <QuillEditor
                value={content}
                onChange={handleChange}
                placeholder="Start typing..."
              />
            </div>
          </div>
        </div>
      </SettingDiv>

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
