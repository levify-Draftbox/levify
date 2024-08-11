import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SettingDiv, SettingTitle } from "./components";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import QuillEditor from "@/components/ui/Quill";
import { useState } from "react";

const Composer = () => {
  const [content, setContent] = useState<string>("");

  const handleChange = (value: string) => {
    setContent(value);
  };

  return (
    <div>
      <SettingDiv>
        <SettingTitle>Default Browser Composer</SettingTitle>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Enable" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Enable">Enable</SelectItem>
            <SelectItem value="disable">Disable</SelectItem>
          </SelectContent>
        </Select>
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

      <SettingDiv className="mb-14">
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
