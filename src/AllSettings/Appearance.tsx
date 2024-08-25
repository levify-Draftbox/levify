import { useEffect, useState } from "react";
import { useProfileStore } from "@/store/profile";
import { SettingDiv, SettingTitle } from "./components";
import { Spinner } from "@/components/Spinner";
import { cn } from "@/lib/utils";
import { ThemeColors } from "@/components/Theme";
import { Select, SelectItem, SelectContent, SelectGroup, SelectTrigger, SelectValue } from "@/components/ui/select";

const Appearance = () => {
  const { allSetting, updateSettings } = useProfileStore();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (allSetting?.appearance?.layout === "Horizontal") {
      setSelectedImage(1);
    }
  }, [allSetting]);

  interface AppearanceSettings extends Record<string, unknown> {
    color?: string;
    theme?: string;
    layout?: string;
    mailLayout?: string;
  }

  const [selectedMailLayout, setSelectedMailLayout] = useState<string | null>(
    allSetting?.appearance?.mailLayout || null
  );

  const handleImageClick = (index: number, layout: string) => {
    setSelectedImage(index);
    updateAppearance({ layout });
  };

  const handleMailLayoutClick = (Maillayout: string) => {
    setSelectedMailLayout(Maillayout);
    updateAppearance({ mailLayout: Maillayout });
  };

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
    system: <div className="flex gap-2 items-center">
      <div className="h-4 w-6 border border-input rounded-sm" style={{
        background: "linear-gradient(to left, white 50%, #1a1a1a 50%)",
      }} />
      System
    </div>,
    dark: <div className="flex gap-2 items-center">
      <div className="h-4 w-6 border dark:border-input-border-hover border-input rounded-sm bg-[#1a1a1a]" />
      Dark
    </div>,
    light: <div className="flex gap-2 items-center">
      <div className="h-4 w-6 border border-button-active dark:border-input-border-hover rounded-sm bg-white" />
      Light
    </div>,
  };
  return (
    <div className="w-full h-full">
      {isLoading && <Spinner className="absolute" />}
      <div>
        <SettingTitle>Theme</SettingTitle>

        <SettingDiv>
          <Select onValueChange={(v) => updateAppearance({ theme: v })} value={allSetting?.appearance?.theme || "system"}>
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
        </SettingDiv>

        <SettingTitle>Colors</SettingTitle>

        <SettingDiv>
          <Select onValueChange={(v) => updateAppearance({ color: v })} value={allSetting?.appearance?.color || "purple"}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select Theme" />
            </SelectTrigger>
            <SelectContent position="item-aligned">
              <SelectGroup>
                {Object.keys(ThemeColors).map((e: string, i) => (
                  <SelectItem key={i} value={e} dontShowCheck>
                    <div className="flex gap-2 items-center capitalize">
                      <div className="h-4 w-6 border border-input rounded-sm" style={{
                        background: ThemeColors[e],
                      }} />
                      {e}
                    </div>
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </SettingDiv>

        <SettingTitle>Layout</SettingTitle>
        <div className="flex flex-col mt-2 gap-4">
          <SettingDiv className="flex gap-4">
            <div>
              <img
                src="./download (1).jpg"
                className={cn(
                  `h-24 w-36 object-cover rounded-md ${selectedImage === 1 ? "ring-2 ring-core" : ""
                  }`,
                  {
                    "ring-2 ring-core":
                      allSetting?.appearance?.layout === "Horizontal",
                  }
                )}
                onClick={() => handleImageClick(1, "Horizontal")}
                alt="Image 1"
              />
              <p className="text-center mt-2">Horizontal</p>
            </div>
            <div>
              <img
                src="./download.jpg"
                className={cn(
                  `h-24 w-36 object-cover rounded-md ${selectedImage === 2 ? "ring-2 ring-core" : ""
                  }`,
                  {
                    "ring-2 ring-core":
                      allSetting?.appearance?.layout === "Vertical",
                  }
                )}
                onClick={() => handleImageClick(2, "Vertical")}
                alt="Image 2"
              />
              <p className="text-center mt-2">Vertical</p>
            </div>
            <div>
              <img
                src="./download.jpg"
                className={cn(
                  `h-24 w-36 object-cover rounded-md ${selectedImage === 3 ? "ring-2 ring-core" : ""
                  }`,
                  {
                    "ring-2 ring-core":
                      allSetting?.appearance?.layout === "OpeninNewTab",
                  }
                )}
                onClick={() => handleImageClick(3, "Open in New Tab")}
                alt="Image 3"
              />
              <p className="text-center mt-2">Open in New Tab</p>
            </div>
          </SettingDiv>

          {selectedImage === 1 && (
            <div>
              <SettingTitle>Mail Layout</SettingTitle>
              <SettingDiv>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-4">
                    <div>
                      <img
                        src="./download (1).jpg"
                        className={cn(
                          `h-24 w-36 object-cover rounded-md ${selectedMailLayout === "sender" ||
                            allSetting?.appearance?.mailLayout === "sender"
                            ? "ring-2 ring-core"
                            : ""
                          }`
                        )}
                        onClick={() => handleMailLayoutClick("sender")}
                        alt="Sender First Layout"
                      />
                      <p className="text-center mt-2">Sender First</p>
                    </div>

                    <div>
                      <img
                        src="./download.jpg"
                        className={cn(
                          `h-24 w-36 object-cover rounded-md ${selectedMailLayout === "subject" ||
                            allSetting?.appearance?.mailLayout === "subject"
                            ? "ring-2 ring-core"
                            : ""
                          }`
                        )}
                        onClick={() => handleMailLayoutClick("subject")}
                        alt="Subject First Layout"
                      />
                      <p className="text-center mt-2">Subject First</p>
                    </div>
                  </div>
                </div>
              </SettingDiv>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Appearance;
