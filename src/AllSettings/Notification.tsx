import { Button } from "@/components/ui/button";
import { SettingDiv } from "./components";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useCallback, useEffect } from "react";
import { BellRinging, BellSlash, SpeakerHigh } from "@phosphor-icons/react";
import { useProfileStore } from "@/store/profile";

const sounds = [
  { name: "Bell", src: "/sounds/bell.wav" },
  { name: "Mixkit", src: "/sounds/mixkit.wav" },
  { name: "Pop", src: "/sounds/pop.wav" },
];

const NotificationSetting = () => {
  const { allSetting, updateSettings } = useProfileStore();
  const [notiEnable, setNotiEnable] = useState(false);
  const [selectedSound, setSelectedSound] = useState<string | null>(null);
  const [isSoundLoading, setIsSoundLoading] = useState(false);
  const [isNotiLoading, setIsNotiLoading] = useState(false);

  useEffect(() => {
    if (allSetting.notification) {
      setNotiEnable(allSetting.notification.desktopNotificationSound || false);
      setSelectedSound(allSetting.notification.notificationSound || null);
    }
  }, [allSetting.notification]);

  const playSound = useCallback((soundSrc: string | null) => {
    if (!soundSrc) {
      console.warn("No sound selected");
      return;
    }
    const audio = new Audio(soundSrc);
    audio.play().catch((error) => {
      console.error("Error playing sound:", error);
    });
  }, []);

  const updateAppearance = async (
    obj: any,
    loadingSetter: (loading: boolean) => void
  ) => {
    loadingSetter(true);
    try {
      await updateSettings("notification", obj);
    } catch (error) {
      console.error("Error updating settings:", error);
    } finally {
      loadingSetter(false);
    }
  };

  const handleSoundChange = async (value: string) => {
    const sound = sounds.find((s) => s.name === value);
    if (sound) {
      setSelectedSound(sound.src);
      playSound(sound.src);
      await updateAppearance(
        { notificationSound: sound.src },
        setIsSoundLoading
      );
    }
  };

  const handleNotificationToggle = async () => {
    if (!notiEnable) {
      if (!("Notification" in window)) {
        alert("This browser does not support desktop notifications");
      } else if (Notification.permission === "granted") {
        new Notification("Hi there!");
      } else if (Notification.permission !== "denied") {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          new Notification("Hi there!");
        }
      }
    }

    const newNotiEnable = !notiEnable;
    setNotiEnable(newNotiEnable);

    await updateAppearance(
      { desktopNotificationSound: newNotiEnable },
      setIsNotiLoading
    );
  };

  return (
    <div className="w-full h-full">
      <SettingDiv>
        <h2 className="text-sm mt-5 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70dark:text-whitex">
          Notification Sound
        </h2>
        <div className="flex justify-between items-center">
          <p className="text-xs  text-[rgba(0,0,0,0.5)] dark:text-[rgba(255,255,255,0.5)]">
            Sets the default notification sound for incoming messages.
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="ml-2 p-2 text-gray-500 hover:text-gray-700"
              onClick={() => playSound(selectedSound)}
              aria-label="Play selected sound"
              disabled={!selectedSound || isSoundLoading}
            >
              <SpeakerHigh size={24} />
            </button>
            <Select
              onValueChange={handleSoundChange}
              value={
                selectedSound
                  ? sounds.find((s) => s.src === selectedSound)?.name
                  : undefined
              }
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
          </div>
        </div>
      </SettingDiv>

      <SettingDiv>
        <h2 className="text-sm mt-5 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70dark:text-whitex">
          Desktop Notifications
        </h2>
        <div className="flex justify-between items-center w-full">
          <p className="text-xs  text-[rgba(0,0,0,0.5)] dark:text-[rgba(255,255,255,0.5)]">
            Sets the default notification sound for incoming messages.
          </p>
          <div className="flex items-center gap-2">
            <Button
              className="w-fit px-4"
              onClick={handleNotificationToggle}
              variant={notiEnable ? "primary" : "secondary"}
              disabled={isNotiLoading}
            >
              {notiEnable ? (
                <div className="flex gap-1 items-center">
                  <BellRinging size={16} />
                  Enabled
                </div>
              ) : (
                <div className="flex gap-1 items-center">
                  <BellSlash size={16} />
                  Disabled
                </div>
              )}
            </Button>
          </div>
        </div>
      </SettingDiv>

      {/* <SettingDiv className="relative w-full !mb-0 pt-1">
        <div className="w-full">
          <div className="flex gap-3 justify-end"></div>
        </div>
      </SettingDiv> */}
    </div>
  );
};

export default NotificationSetting;
