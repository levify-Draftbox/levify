import { useState } from "react";
import { useProfileStore } from "@/store/profile";
import { SettingDiv, SettingHr } from "./components";
import { Spinner } from "@/components/Spinner";
import { ThemeColors } from "@/components/Theme";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectGroup,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Rows, TextAlignJustify, TextColumns } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";

const Appearance = () => {
  const { allSetting, updateSettings } = useProfileStore();
  const [isLoading, setIsLoading] = useState(false);

  interface AppearanceSettings extends Record<string, unknown> {
    color?: string;
    theme?: string;
    layout?: string;
    mailLayout?: string;
  }

  const updateAppearance = async (obj: AppearanceSettings) => {
    setIsLoading(true);
    try {
      await updateSettings("appearance", obj);
    } catch (error) {
      console.error("Error updating settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const ThemeOptions: any = {
    system: (
      <div className="flex gap-2 items-center">
        <div className="h-4 w-6  rounded-sm bg-[length:100%_100%] bg-[left_calc(50%)_top] bg-[linear-gradient(to_right,#000_55%,#fff_45%)]" />
        System
      </div>
    ),
    dark: (
      <div className="flex gap-2 items-center">
        <div className="h-4 w-6 border dark:border-input-border-hover border-input rounded-sm bg-[#1a1a1a]" />
        Dark
      </div>
    ),
    light: (
      <div className="flex gap-2 items-center">
        <div className="h-4 w-6 border border-button-active dark:border-input-border-hover rounded-sm bg-white" />
        Light
      </div>
    ),
  };

  const layout: any = {
    Column: (
      <div className="flex gap-2 items-center">
        <TextColumns size={20} />
        Column
      </div>
    ),
    Row: (
      <div className="flex gap-2 items-center">
        <TextAlignJustify size={20} />
        Row
      </div>
    ),
    Open: (
      <div className="flex gap-2 items-center">
        <Rows size={20} />
        New Tab
      </div>
    ),
  };

  return (
    <>
      <div className="w-full h-full">
        <div>
          <SettingDiv>
            <h2 className="text-sm mt-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-white">
              Theme
            </h2>
            <div className="flex mt-1 justify-between items-center">
              <p className="text-xs text-[rgba(0,0,0,0.5)] dark:text-[rgba(255,255,255,0.5)]">
                Sets the default visual theme for the application, including
                colors and styles.
              </p>
              <Select
                onValueChange={(v) => updateAppearance({ theme: v })}
                value={allSetting?.appearance?.theme || "system"}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Select Theme" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  <SelectGroup>
                    {Object.keys(ThemeOptions).map((e: string, i) => (
                      <SelectItem key={i} value={e} dontShowCheck>
                        {ThemeOptions[e]}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </SettingDiv>

          <SettingDiv>
            <h2 className="text-sm mt-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-white">
              Colors
            </h2>
            <div className="flex mt-1 justify-between items-center">
              <p className="text-xs text-[rgba(0,0,0,0.5)] dark:text-[rgba(255,255,255,0.5)]">
                Customizes the color scheme to match user preferences or branding.
              </p>
              <Select
                onValueChange={(v) => updateAppearance({ color: v })}
                value={allSetting?.appearance?.color || "purple"}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Select Color" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  <SelectGroup>
                    {Object.keys(ThemeColors).map((e: string, i) => (
                      <SelectItem key={i} value={e} dontShowCheck>
                        <div className="flex gap-2 items-center capitalize">
                          <div
                            className="h-4 w-6 border border-input rounded-sm"
                            style={{
                              background: ThemeColors[e],
                            }}
                          />
                          {e}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </SettingDiv>

          <SettingDiv>
            <h2 className="text-sm mt-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-white">
              Layout
            </h2>
            <div className="flex mt-1 justify-between items-center">
              <p className="text-xs text-[rgba(0,0,0,0.5)] dark:text-[rgba(255,255,255,0.5)]">
                Adjusts the arrangement and design of the application's interface
                elements.
              </p>
              <Select
                onValueChange={(v) => updateAppearance({ layout: v })}
                value={allSetting?.appearance?.layout || "Column"}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Select Layout" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  <SelectGroup>
                    {Object.keys(layout).map((e: string, i) => (
                      <SelectItem key={i} value={e} dontShowCheck>
                        {layout[e]}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </SettingDiv>
        </div>
      </div>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.4 }}
            className="pb-4 sticky bottom-0 bg-background-secondary"
          >
            <SettingHr className="!m-0" />
            <SettingDiv className="relative w-full !mb-0 pt-1">
              <div className="w-full">
                <div className="flex items-center justify-center">
                  <Spinner />
                  <span className="ml-2 text-sm text-gray-500">Updating settings...</span>
                </div>
              </div>
            </SettingDiv>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Appearance;