import { useState } from "react";
import { useProfileStore } from "@/store/profile";
import { SettingDiv, SettingTitle } from "./components";
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

const Appearance = () => {
  const { allSetting, updateSettings } = useProfileStore();
  const [isLoading, setIsLoading] = useState(false);

  interface AppearanceSettings extends Record<string, unknown> {
    color?: string;
    theme?: string;
    layout?: string;
    mailLayout?: string;
  }

  // const [selectedMailLayout, setSelectedMailLayout] = useState<string | null>(
  //   allSetting?.appearance?.mailLayout || null
  // );

  // const handleImageClick = (index: number, layout: string) => {
  //   setSelectedImage(index);
  //   updateAppearance({ layout });
  // };

  // const handleMailLayoutClick = (Maillayout: string) => {
  //   setSelectedMailLayout(Maillayout);
  //   updateAppearance({ mailLayout: Maillayout });
  // };

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
    Columan: (
      <div className="flex gap-2 items-center">
        <TextColumns size={20} />
        Columan
      </div>
    ),
    Row: (
      <div className="flex gap-2 items-center">
        <TextAlignJustify size={20} />
        row
      </div>
    ),
    Open: (
      <div className="flex gap-2 items-center">
        <Rows size={20} />
        new tab
      </div>
    ),
  };
  return (
    <div className="w-full h-full">
      {isLoading && <Spinner className="absolute" />}
      <div>
        <div>
          <SettingDiv>
            <h2 className="text-sm mt-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70dark:text-whitex">
              Theme
            </h2>
            <div className="flex mt-1 justify-between items-center">
              <p className="text-xs  text-[rgba(0,0,0,0.5)] dark:text-[rgba(255,255,255,0.5)]">
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
        </div>

        <SettingDiv>
          <h2 className="text-sm mt-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70dark:text-whitex">
            Colors
          </h2>
          <div className="flex mt-1 justify-between items-center">
            <p className="text-xs  text-[rgba(0,0,0,0.5)] dark:text-[rgba(255,255,255,0.5)]">
              Customizes the color scheme to match user preferences or branding.
            </p>
            <Select
              onValueChange={(v) => updateAppearance({ color: v })}
              value={allSetting?.appearance?.color || "purple"}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select Theme" />
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
          <h2 className="text-sm mt-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70dark:text-whitex">
            Layout
          </h2>
          <div className="flex mt-1 justify-between items-center">
            <p className="text-xs  text-[rgba(0,0,0,0.5)] dark:text-[rgba(255,255,255,0.5)]">
              Adjusts the arrangement and design of the application's interface
              elements.
            </p>
            <Select
              onValueChange={(v) => updateAppearance({ layout: v })}
              value={allSetting?.appearance?.layout || "columan"}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select layout" />
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
  );
};

export default Appearance;
