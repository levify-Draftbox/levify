import { useState } from "react";
import { SettingDiv } from "./components";
import { useProfileStore } from "@/store/profile";
import { Switch } from "@/components/ui/switch";

const Privacy = () => {
  const { allSetting, updateSettings } = useProfileStore();
  const [loadExternal, setLoadExternal] = useState(
    allSetting.privacy.loadExternalImages
  );

  const handleToggle = async (checked: boolean) => {
    setLoadExternal(checked);

    try {
      await updateSettings("privacy", { loadExternalImages: checked });
    } catch (error) {
      console.error("Failed to update settings:", error);
    }
  };

  return (
    <div className="relative">
      <SettingDiv>
        <div className="flex gap-10 cursor-pointer items-center justify-between">
          <div>
            <h2 className="text-sm mt-5 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70dark:text-whitex">
              Email Privacy
            </h2>
            <p className="text-xs text-[rgba(0,0,0,0.5)] dark:text-[rgba(255,255,255,0.5)] mt-2 mb-3">
              Load external images or Sources.
            </p>
          </div>
          <Switch checked={loadExternal} onCheckedChange={handleToggle} />
        </div>
      </SettingDiv>
    </div>
  );
};

export default Privacy;
