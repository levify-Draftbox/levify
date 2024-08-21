import { useEffect, useState } from "react";
import { useProfileStore } from "@/store/profile";
import { SettingDiv, SettingTitle } from "./components";
import { Spinner } from "@/components/Spinner";
import { cn } from "@/lib/utils";
import { ThemeColors } from "@/components/Theme";

const Appearance = () => {
  const { allSetting, updateSettings } = useProfileStore();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [, setError] = useState<string | null>(null);

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
    setError(null);
    try {
      await updateSettings("appearance", obj);
    } catch (error) {
      console.error("Error updating settings:", error);
      setError("Failed to update settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const ThemeOptions = {
    system: "System",
    dark: "Dark",
    light: "Light",
  };
  return (
    <div className="w-full h-full">
      {isLoading && <Spinner className="absolute" />}
      <div>
        <SettingTitle>Theme</SettingTitle>
        <SettingDiv className="flex flex-wrap gap-4">
          {Object.keys(ThemeOptions).map((themeOption, index) => {
            const themeName =
              ThemeOptions[themeOption as keyof typeof ThemeOptions];
            return (
              <button
                key={index}
                className={cn(
                  `flex items-center space-x-2 p-3 w-40 gap-3 rounded-md transition-all duration-200 border`,
                  {
                    "border-core":
                      allSetting?.appearance?.theme === themeOption,
                  }
                )}
                onClick={() => updateAppearance({ theme: themeOption })}
              >
                <div
                  className={`w-10 h-10 rounded-full ${
                    themeOption === "system"
                      ? "bg-gradient-to-l from-black to-white rotate-[-45deg]"
                      : themeOption === "dark"
                      ? "bg-black"
                      : "bg-white border border-gray-400"
                  }`}
                ></div>
                <span className="text-sm">{themeName}</span>
              </button>
            );
          })}
        </SettingDiv>

        <SettingTitle>Colors</SettingTitle>
        <SettingDiv className="flex flex-wrap gap-4">
          {Object.keys(ThemeColors).map((color, index) => {
            const colorValue = ThemeColors[color as keyof typeof ThemeColors];
            return (
              <button
                key={index}
                className={cn(
                  `flex items-center space-x-2 p-3 w-40 gap-3 rounded-md transition-all duration-200 border`,
                  {
                    "border-core": allSetting?.appearance?.color === color,
                  }
                )}
                style={
                  {
                    "--hover-color": colorValue,
                    borderColor:
                      allSetting?.appearance?.color === color
                        ? colorValue
                        : undefined,
                  } as React.CSSProperties
                }
                onClick={() => updateAppearance({ color: color })}
              >
                <div
                  className="w-10 h-10 rounded-full"
                  style={{
                    background: colorValue,
                  }}
                ></div>
                <span className="text-sm capitalize">{color}</span>
              </button>
            );
          })}
        </SettingDiv>

        <SettingTitle>Layout</SettingTitle>
        <div className="flex flex-col mt-2 gap-4">
          <SettingDiv className="flex gap-4">
            <div>
              <img
                src="./download (1).jpg"
                className={cn(
                  `h-24 w-36 object-cover rounded-md ${
                    selectedImage === 1 ? "ring-2 ring-core" : ""
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
                  `h-24 w-36 object-cover rounded-md ${
                    selectedImage === 2 ? "ring-2 ring-core" : ""
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
                  `h-24 w-36 object-cover rounded-md ${
                    selectedImage === 3 ? "ring-2 ring-core" : ""
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
              <div className="flex flex-col gap-2">
                <div className="flex gap-4">
                  <div>
                    <img
                      src="./download (1).jpg"
                      className={cn(
                        `h-24 w-36 object-cover rounded-md ${
                          selectedMailLayout === "sender" ||
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
                        `h-24 w-36 object-cover rounded-md ${
                          selectedMailLayout === "subject" ||
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appearance;
