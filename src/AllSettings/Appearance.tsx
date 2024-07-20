import { useState } from "react";
import { SettingDiv, SettingTitle } from "./components";
import { ThemeColors, useTheme } from "@/components/Theme-provider";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const Appearance = () => {
  const { setTheme, setThemeColor, theme, themeColor } = useTheme();

  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const handleImageClick = (index: number) => {
    setSelectedImage(index);
  };



  return (
    <div className="w-full h-full">
      <div>
        <SettingTitle>Theme</SettingTitle>
        <SettingDiv className="flex flex-wrap gap-4">
          <div
            className={`w-10 h-10 rounded-full border-[1px] border-gray-400 ${
              theme === "system" && "ring-2 ring-gray-600 dark:ring-gray-200"
            }`}
            style={{
              background: "linear-gradient(to left, black 50%, white 50%)",
              rotate: "-45deg",
            }}
            onClick={() => setTheme("system")}
          ></div>
          <div
            className={`w-10 h-10 rounded-full bg-black ${
              theme === "dark" && "ring-2 ring-gray-600 dark:ring-gray-200"
            }`}
            onClick={() => setTheme("dark")}
          ></div>
          <div
            className={`w-10 h-10 rounded-full border-[1px] border-gray-400 bg-white ${
              theme === "light" && "ring-2 ring-gray-600 dark:ring-gray-200"
            }`}
            onClick={() => setTheme("light")}
          ></div>
        </SettingDiv>

        <SettingTitle>Colors</SettingTitle>
        <SettingDiv className="flex flex-wrap gap-4">
          {Object.keys(ThemeColors).map((color, index) => (
            <div
              key={index}
              className={`w-10 h-10 rounded-full ${
                themeColor === color
                  ? "ring-2 ring-gray-600 dark:ring-gray-200"
                  : ""
              }`}
              style={{
                background: ThemeColors[color as keyof typeof ThemeColors],
              }}
              onClick={() => setThemeColor(color as keyof typeof ThemeColors)}
            ></div>
          ))}
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

        <SettingTitle>Who frist</SettingTitle>
        <SettingDiv>
          <RadioGroup defaultValue="comfortable">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="default" id="r1" />
              <Label htmlFor="r1">Sender frist</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="comfortable" id="r2" />
              <Label htmlFor="r2">Subject frist</Label>
            </div>
          </RadioGroup>
        </SettingDiv>

       
      </div>
    </div>
  );
};

export default Appearance;
