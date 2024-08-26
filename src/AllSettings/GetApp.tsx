import { Button } from "@/components/ui/button";
import { SettingDiv, SettingHr, SettingTitle } from "./components";

const GetApp = () => {
  let theme = "dark";

  return (
    <div>
      <SettingTitle>Download the mobile apps</SettingTitle>
      <SettingHr />
      <SettingDiv>
        <div className="w-64 border-[1px] flex flex-col items-center rounded-md h-60">
          <img className="w-20 h-20 mt-5 border-[1px]" src="/public/qr.png" />
          <div className="w-44 mt-5">
            <img
              className="w-"
              alt="DraftBox Mail"
              src={
                theme === "system"
                  ? !window.matchMedia("(prefers-color-scheme: dark)").matches
                    ? "/logo-light.svg"
                    : "/logo-dark.svg"
                  : theme === "light"
                  ? "/logo-light.svg"
                  : "/logo-dark.svg"
              }
            />
          </div>
          <div className="w-full flex justify-center gap-2 mt-6">
            <div>
              <img className="w-28" src="/public/getappstore.png" />
            </div>
            <div>
              <img className="w-28" src="/public/getgoogleplay.png" />
            </div>
          </div>
        </div>
      </SettingDiv>

      <SettingTitle>Download the desktop apps</SettingTitle>
      <SettingHr />
      <SettingDiv className="flex gap-7">
        <DesktopApp
          lightImg="/windows.svg"
          darkImg="/windows-dark.svg"
          paltform="For Windows"
        />
         <DesktopApp
          lightImg="/public/apple-light.svg"
          darkImg="/public/apple-dark.svg"
          paltform="For Windows"
        />
          <DesktopApp
          lightImg="/public/linux-light.svg"
          darkImg="/public/linux-dark.svg"
          paltform="For Windows"
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
  let theme = "dark";

  const imageSrc = theme === "light" ? lightImg : darkImg;

  return (
    <div className="w-64 border-[1px] flex flex-col items-center rounded-md h-56">
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
