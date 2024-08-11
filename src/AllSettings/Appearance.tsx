import { useState } from "react";
import { SettingDiv, SettingTitle } from "./components";
import { ThemeColors, useTheme } from "@/components/Theme-provider";

const Appearance = () => {
  const { setTheme, setThemeColor, theme, themeColor } = useTheme();

  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const handleImageClick = (index: number) => {
    setSelectedImage(index);
  };

  const ThemeOptions = {
    system: "System",
    dark: "Dark",
    light: "Light",
  };

  return (
    <div className="w-full h-full">
      <div>
        <SettingTitle>Theme</SettingTitle>
        <SettingDiv className="flex flex-wrap gap-4">
          {Object.keys(ThemeOptions).map((themeOption, index) => {
            const themeName = ThemeOptions[themeOption as keyof typeof ThemeOptions];
            return (
              <button
                key={index}
                className={`flex items-center space-x-2 p-3 w-40 gap-3 rounded-md transition-all duration-200
                border-2 ${
                  theme === themeOption
                    ? "ring-2 ring-gray-600 dark:ring-gray-200"
                    : "border-gray-200 dark:border-gray-700 hover:ring-2 hover:ring-gray-400"
                }`}
                onClick={() => setTheme(themeOption as keyof typeof ThemeOptions)}
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
                className={`flex items-center space-x-2 p-3 w-40 gap-3 rounded-md transition-all duration-200
          border-2 ${
            themeColor === color
              ? "ring-2"
              : "border-gray-200 dark:border-gray-700 hover:ring-2"
          }`}
                style={
                  {
                    "--hover-color": colorValue,
                    borderColor: themeColor === color ? colorValue : undefined,
                  } as React.CSSProperties
                }
                onClick={() => setThemeColor(color as keyof typeof ThemeColors)}
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
        <SettingDiv className="flex mt-2 gap-4">
          <div>
            <img
              src="./download (1).jpg"
              className={`h-24 w-36 object-cover rounded-md ${
                selectedImage === 1 ? "ring-2 ring-core" : ""
              }`}
              onClick={() => handleImageClick(1)}
              alt="Image 1"
            />
            <p className="text-center mt-2">Row</p>
          </div>
          <div>
            <img
              src="./download.jpg"
              className={`h-24 w-36 object-cover rounded-md ${
                selectedImage === 2 ? "ring-2 ring-core" : ""
              }`}
              onClick={() => handleImageClick(2)}
              alt="Image 2"
            />
            <p className="text-center mt-2">column</p>
          </div>

          <div>
            <img
              src="./download.jpg"
              className={`h-24 w-36 object-cover rounded-md ${
                selectedImage === 3 ? "ring-2 ring-core" : ""
              }`}
              onClick={() => handleImageClick(3)}
              alt="Image 2"
            />
            <p className="text-center mt-2">Open in new tab</p>
          </div>
        </SettingDiv>
      </div>
    </div>
  );
};

export default Appearance;
