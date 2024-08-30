import { useEffect, useState } from "react";
import { useProfileStore } from "@/store/profile";
import { SettingDiv } from "./components";
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
import {
  TextAlignJustify,
  TextColumns,
} from "@phosphor-icons/react";

const Appearance = () => {
  const { allSetting, updateSettings } = useProfileStore();
  const [isLoading, setIsLoading] = useState(false);

  const [options, setOptions] = useState({
    layout: allSetting?.appearance?.layout || "Columan",
    theme: allSetting?.appearance?.theme || "system",
    color: allSetting?.appearance?.color || "purple",
    displayOrder: allSetting?.appearance?.displayOrder || "Subject First"
  })

  interface AppearanceSettings extends Record<string, unknown> {
    color?: string;
    theme?: string;
    layout?: string;
    displayOrder?: string;
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
        <div className="h-4 w-6 rounded-sm bg-[length:100%_100%] bg-[left_calc(50%)_top] bg-[linear-gradient(to_right,#000_55%,#fff_45%)]" />
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
    Columan: (
      <div className="flex gap-2 items-center">
        <TextColumns size={20} />
        Columan
      </div>
    ),
    Row: (
      <div className="flex gap-2 items-center">
        <TextAlignJustify size={20} />
        Row
      </div>
    ),
    Open: (
      <div className="flex gap-2 !items-center">
        <img className="h-6 mt-1" src="/new tab.svg" />
        <p>New Tab</p>
      </div>
    ),
  };

  const displayOrder: any = {
    "Subject First": (
      <div className="flex gap-2 items-center">Subject First</div>
    ),
    "Sender First": <div className="flex gap-2 items-center">Sender First</div>,
  };

  return (
    <div className="w-full h-full">
      {isLoading && <Spinner className="absolute" />}
      <div>
        <SettingDiv>
          <h2 className="text-sm  leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-whitex">
            Theme
          </h2>
          <div className="flex mt-1 justify-between items-center">
            <p className="text-xs text-[rgba(0,0,0,0.5)] dark:text-[rgba(255,255,255,0.5)]">
              Set the default visual theme for the application, including colors
              and styles.
            </p>
            <Select onValueChange={(v) => {
              setOptions((o) => ({
                ...o,
                theme: v
              }))
              updateAppearance({
                ...options,
                theme: v
              })
            }} value={options.theme}>
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
          <h2 className="text-sm mt-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-whitex">
            Colors
          </h2>
          <div className="flex mt-1 justify-between items-center">
            <p className="text-xs text-[rgba(0,0,0,0.5)] dark:text-[rgba(255,255,255,0.5)]">
              Customize the color scheme to match user preferences or branding.
            </p>
            <Select onValueChange={(v) => {
              setOptions((o) => ({
                ...o,
                color: v
              }))
              updateAppearance({
                ...options,
                color: v
              })
            }} value={options.color}>
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
                          style={{ background: ThemeColors[e] }}
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
          <h2 className="text-sm mt-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-whitex">
            Layout
          </h2>
          <div className="flex mt-1 justify-between items-center">
            <p className="text-xs text-[rgba(0,0,0,0.5)] dark:text-[rgba(255,255,255,0.5)]">
              Adjust the arrangement and design of the application's interface
              elements.
            </p>
            <Select onValueChange={(v) => {
              setOptions((o) => ({
                ...o,
                layout: v
              }))
              updateAppearance({
                ...options,
                layout: v
              })
            }} value={options.layout}>
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

        {options.layout === "Columan" && (
          <SettingDiv>
            <h3 className="text-sm leading-none">Display Order</h3>
            <div className="flex mt-1 justify-between items-center">
              <p className="text-xs text-[rgba(0,0,0,0.5)] dark:text-[rgba(255,255,255,0.5)]">
                Set whether emails display the subject or sender name first.
              </p>
              <Select
                onValueChange={(v) => {
                  setOptions((o) => ({
                    ...o,
                    displayOrder: v
                  }))
                  updateAppearance({
                    ...options,
                    displayOrder: v
                  })
                }}
                value={options.displayOrder}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Select Order" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  <SelectGroup>
                    {Object.keys(displayOrder).map((e: string, i) => (
                      <SelectItem key={i} value={e} dontShowCheck>
                        {displayOrder[e]}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </SettingDiv>
        )}
      </div>
    </div>
  );
};

export default Appearance;
