import React, { useEffect, useState } from "react";
import moment from "moment-timezone";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "@/components/ui/select";
import { SettingDiv, SettingHr, SettingTitle } from "./components";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useProfileStore } from "@/store/profile";

type TimeZone = {
  value: string;
  label: string;
  offset: number;
  abbr: string;
  country: string;
};

type GroupedTimeZones = Record<string, TimeZone[]>;

interface LanguageAndTimeSettings {
  language: string;
  setTimezoneAutomatically: boolean;
  timeZone: string;
}

const LanguageAndTime: React.FC = () => {
  const { allSetting, updateSettings } = useProfileStore();

  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    allSetting.languageandtime.language
  );
  const [selectedTimeZone, setSelectedTimeZone] = useState<string>(
    allSetting.languageandtime.timeZone
  );
  const [autoTimeZone, setAutoTimeZone] = useState<boolean>(
    allSetting.languageandtime.setTimezoneAutomatically
  );

  useEffect(() => {
    if (allSetting.notification) {
      setSelectedLanguage(allSetting.languageandtime.language || "");
      setSelectedTimeZone(allSetting.languageandtime.timeZone || "");
      setAutoTimeZone(
        allSetting.languageandtime.setTimezoneAutomatically || false
      );
    }
  }, [allSetting.languageandtime]);

  const updateLanguageandTime = async (
    obj: LanguageAndTimeSettings,
    loadingSetter: (loading: boolean) => void
  ) => {
    loadingSetter(true);
    try {
      await updateSettings("languageandtime", obj);
    } catch (error) {
      console.error("Error updating settings:", error);
    } finally {
      loadingSetter(false);
    }
  };

  const languages: string[] = [
    "English / English",
    "हिंदी / Hindi",
    "中文 / Chinese",
    "Español / Spanish",
  ];

  const timeZones: TimeZone[] = moment.tz
    .names()
    .map((tz) => {
      const zone = moment.tz(tz);
      return {
        value: tz,
        label: `(UTC${zone.format("Z")}) ${tz.replace(/_/g, " ")}`,
        offset: zone.utcOffset(),
        abbr: zone.zoneAbbr(),
        country: tz.split("/")[0],
      };
    })
    .sort((a, b) => a.offset - b.offset);

  const groupedTimeZones: GroupedTimeZones = timeZones.reduce((acc, tz) => {
    const country = tz.value.split("/")[0];
    if (!acc[country]) {
      acc[country] = [];
    }
    acc[country].push(tz);
    return acc;
  }, {} as GroupedTimeZones);

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    const updatedSettings: LanguageAndTimeSettings = {
      language: value,
      setTimezoneAutomatically: autoTimeZone,
      timeZone: selectedTimeZone,
    };
    updateLanguageandTime(updatedSettings, () => {});
  };

  const handleTimeZoneChange = (value: string) => {
    setSelectedTimeZone(value);
    const updatedSettings: LanguageAndTimeSettings = {
      language: selectedLanguage,
      setTimezoneAutomatically: autoTimeZone,
      timeZone: value,
    };
    updateLanguageandTime(updatedSettings, () => {});
  };

  const handleAutoTimeZoneChange = (checked: boolean) => {
    setAutoTimeZone(checked);
    const localTimeZone = checked
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : selectedTimeZone;
    setSelectedTimeZone(localTimeZone);

    const updatedSettings: LanguageAndTimeSettings = {
      language: selectedLanguage,
      setTimezoneAutomatically: checked,
      timeZone: localTimeZone,
    };
    updateLanguageandTime(updatedSettings, () => {});
  };

  return (
    <div>
      <SettingTitle>Language</SettingTitle>
      <SettingHr />
      <SettingDiv>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-sm mt-3 leading-none">Language & Region</h2>
            <div className="flex mt-1 items-center justify-between">
              <label
                htmlFor="language-select"
                className="text-xs text-[rgba(0,0,0,0.5)] dark:text-[rgba(255,255,255,0.5)] mt-1"
              >
                Change the language used in the user interface.
              </label>
            </div>
          </div>
          <Select onValueChange={handleLanguageChange} value={selectedLanguage}>
            <SelectTrigger className="w-72">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent position="item-aligned">
              <SelectGroup>
                {languages.length > 0 ? (
                  languages.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem disabled value="">
                    No languages available
                  </SelectItem>
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </SettingDiv>

      <SettingTitle>Time</SettingTitle>
      <SettingHr />

      <SettingDiv>
        <div className="flex flex-col mt-5">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h2 className="text-sm mt-3 leading-none">
                Set timezone automatically using your location
              </h2>
              <div className="flex mt-1 items-center justify-between">
                <label
                  htmlFor="auto-timezone-switch"
                  className="text-xs text-[rgba(0,0,0,0.5)] dark:text-[rgba(255,255,255,0.5)] mt-1"
                >
                  Notifications and emails are delivered based on your time
                  zone.
                </label>
              </div>
            </div>
            <Switch
              id="auto-timezone-switch"
              checked={autoTimeZone}
              onCheckedChange={handleAutoTimeZoneChange}
            />
          </div>

          <div className="flex justify-between items-center mt-2">
            <div>
              <h2 className="text-sm mt-3 leading-none">Time Zone</h2>
              <div className="flex mt-1 items-center justify-between">
                <label
                  htmlFor="time-zone-select"
                  className="text-xs text-[rgba(0,0,0,0.5)] dark:text-[rgba(255,255,255,0.5)] mt-1"
                >
                  Current time zone setting.
                </label>
              </div>
            </div>
            <Select
              onValueChange={handleTimeZoneChange}
              value={selectedTimeZone}
              disabled={autoTimeZone}
            >
              <SelectTrigger className="w-72">
                <SelectValue placeholder="Select Time Zone" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-[300px]">
                  {Object.entries(groupedTimeZones).map(([country, zones]) => (
                    <SelectGroup key={country}>
                      <SelectLabel>{country}</SelectLabel>
                      {zones.map((zone) => (
                        <SelectItem key={zone.value} value={zone.value}>
                          {zone.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>
        </div>
      </SettingDiv>
    </div>
  );
};

export default LanguageAndTime;
