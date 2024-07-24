import { SettingDiv, SettingTitle } from "./components";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Notification = () => {
  return (
    <div className="w-full h-full">
      <SettingDiv >
        <SettingTitle>Notification Sound</SettingTitle>
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


      <SettingDiv >
        <SettingTitle>Desktop notifications Sound</SettingTitle>
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

    </div>
  );
};

export default Notification;
