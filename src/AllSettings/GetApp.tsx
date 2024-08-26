import { Button } from "@/components/ui/button";
import { SettingDiv, SettingHr, SettingTitle } from "./components";
import { useProfileStore } from "@/store/profile";

const GetApp = () => {
  const { allSetting } = useProfileStore();
  const theme = allSetting?.appearance?.theme;

  return (
    <div>
      <SettingTitle>Download the mobile apps</SettingTitle>
      <SettingHr />
      <SettingDiv className="flex gap-7">
     
        <DesktopApp
          lightImg="/android-light.svg"
          darkImg="/android-dark.svg"
          paltform="For Android"
        />

        <DesktopApp
          lightImg="/apple-light.svg"
          darkImg="/apple-dark.svg"
          paltform="For Ios"
        />
      </SettingDiv>

      <SettingTitle>Download the desktop apps</SettingTitle>
      <SettingHr />
      <SettingDiv className="flex flex-wrap gap-7">
        <DesktopApp
          lightImg="/windows.svg"
          darkImg="/windows-dark.svg"
          paltform="For Windows"
        />
        <DesktopApp
          lightImg="/apple-light.svg"
          darkImg="/apple-dark.svg"
          paltform="For Mac Os"
        />
        <DesktopApp
          lightImg="/linux-light.svg"
          darkImg="/linux-dark.svg"
          paltform="For Linux"
        />
      </SettingDiv>
    </div>
  );
};

interface DesktopAppProps {
  lightImg: string;
  darkImg: string;
  paltform: string;
}

const DesktopApp: React.FC<DesktopAppProps> = ({
  lightImg,
  darkImg,
  paltform,
}) => {
  const { allSetting } = useProfileStore();
  const theme = allSetting?.appearance?.theme;

  const imageSrc = theme === "light" ? lightImg : darkImg;

  return (
    <div className="w-56 border-[1px] flex flex-col items-center rounded-md h-56">
      <img className="w-10 h-14 mt-8" alt="DraftBox Mail" src={imageSrc} />
      <h2 className="mt-4 font-bold text-lg">{paltform}</h2>
      <p className="text-sm">1.0.0</p>
      <div className="w-full px-5">
        <Button className="mt-4 w-full ">Download</Button>
      </div>
    </div>
  );
};

export { DesktopApp };

export default GetApp;
