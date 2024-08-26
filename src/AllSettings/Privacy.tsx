import { useState, useEffect } from "react";
import { SettingDiv, SettingTitle } from "./components";
import { useProfileStore } from "@/store/profile";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/Spinner";

const Privacy = () => {
  const [loadExternal, setLoadExternal] = useState(false);
  const { allSetting, updateSettings } = useProfileStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (allSetting && allSetting.privacy) {
      setLoadExternal(allSetting.privacy.loadExternalImages);
    }
  }, [allSetting]);

  const handleToggle = async (checked: boolean) => {
    setLoadExternal(checked);
    setIsLoading(true);

    try {
      await updateSettings("privacy", { loadExternalImages: checked });
    } catch (error) {
      console.error("Failed to update settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute ">
          <Spinner />
        </div>
      )}
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
