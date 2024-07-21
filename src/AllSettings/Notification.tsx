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
            <SelectItem value="light">Enable</SelectItem>
            <SelectItem value="dark">disable</SelectItem>
            <SelectItem value="dark">disable</SelectItem>
            <SelectItem value="dark">disable</SelectItem>
          </SelectContent>
        </Select>
      </SettingDiv>


      <SettingDiv >
        <SettingTitle>Notification Sound</SettingTitle>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Enable" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Enable</SelectItem>
            <SelectItem value="dark">disable</SelectItem>
            <SelectItem value="dark">disable</SelectItem>
            <SelectItem value="dark">disable</SelectItem>
          </SelectContent>
        </Select>
      </SettingDiv>

    </div>
  );
};

export default Notification;