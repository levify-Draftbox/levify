import { Button } from "@/components/ui/button";
import { SettingDiv, SettingTitle } from "./components";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { BellRinging, BellSlash } from "@phosphor-icons/react";

const Notification = () => {

  const [notiEnable, setNotiEnable] = useState(false)

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
        <Button
          className="w-fit px-4"
          onClick={() => setNotiEnable(!notiEnable)}
          variant={!notiEnable ? "primary" : "secondary"}
        >
          {!notiEnable ?
            <div className="flex gap-1 items-center">
              <BellRinging size={16} />
              Enable
            </div>
            :
            <div className="flex gap-1 items-center">
              <BellSlash size={16} />
              Disable
            </div>
          }
        </Button>

      </SettingDiv>

    </div>
  );
};

export default Notification;
