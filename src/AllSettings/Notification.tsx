import { Button } from "@/components/ui/button";
import { SettingDiv, SettingTitle } from "./components";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useCallback } from "react";
import { BellRinging, BellSlash } from "@phosphor-icons/react";

const sounds = [
  { name: "Bell", src: "/sounds/bell.wav" },
  { name: "Mixkit", src: "/sounds/mixkit.wav" },
  { name: "Pop", src: "/sounds/pop.wav" },
];

const Notification = () => {
  const [notiEnable, setNotiEnable] = useState(false);
  const [, setSelectedSound] = useState(sounds[0].src);

  const playSound = useCallback((soundSrc: string | undefined) => {
    const audio = new Audio(soundSrc);
    audio.play().catch((error) => {
      console.error("Error playing sound:", error);
    });
  }, []);

  return (
    <div className="w-full h-full">
      <SettingDiv>
        <SettingTitle>Notification Sound</SettingTitle>
        <Select
          onValueChange={(value) => {
            const sound = sounds.find((s) => s.name === value);
            if (sound) {
              setSelectedSound(sound.src);
              playSound(sound.src);
            }
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Sound" />
          </SelectTrigger>
          <SelectContent>
            {sounds.map((sound) => (
              <SelectItem key={sound.src} value={sound.name}>
                {sound.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SettingDiv>

      <SettingDiv>
        <SettingTitle>Desktop Notifications Sound</SettingTitle>
        <Button
          className="w-fit px-4"
          onClick={() => setNotiEnable(!notiEnable)}
          variant={!notiEnable ? "primary" : "secondary"}
        >
          {!notiEnable ? (
            <div className="flex gap-1 items-center">
              <BellRinging size={16} />
              Enable
            </div>
          ) : (
            <div className="flex gap-1 items-center">
              <BellSlash size={16} />
              Disable
            </div>
          )}
        </Button>
      </SettingDiv>
    </div>
  );
};

export default Notification;
