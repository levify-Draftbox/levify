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

const Composer = () => {
  return (
    <div>
      <SettingDiv>
        <SettingTitle>Default Browser Composser</SettingTitle>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Enable" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Enable">Enable</SelectItem>
            <SelectItem value="disable">disable</SelectItem>
          </SelectContent>
        </Select>
      </SettingDiv>

      <SettingDiv>
        <SettingTitle>Compose size</SettingTitle>
        <div className="flex gap-10 cursor-pointer">
          <div className="flex items-center space-x-2">
            <Switch id="airplane-mode" />
            <Label htmlFor="airplane-mode" className="font-normal">Compose full screen</Label>
          </div>
        </div>
      </SettingDiv>

      <SettingDiv>
        <SettingTitle>Signature</SettingTitle>
        <SettingDiv>Signature </SettingDiv>
      </SettingDiv>

      <SettingDiv>
        <SettingTitle>Reply</SettingTitle>
        <SettingDiv>
          <RadioGroup defaultValue="Reply-one">
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="Reply-one" id="Reply-one" />
              <Label htmlFor="option-one">Reply One</Label>
            </div>
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="Reply All" id="Reply All" />
              <Label htmlFor="option-two">Reply All</Label>
            </div>
          </RadioGroup>
        </SettingDiv>
      </SettingDiv>
    </div>
  );
};

export default Composer;
