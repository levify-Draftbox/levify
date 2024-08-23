import { create } from "zustand";
import api from "@/lib/api";

interface SettingsState {
  allSetting: { [_: string]: any };
  emails: string[];
  profile: { [_: string]: any };
  load: boolean;
  fetchAllProfiles: () => Promise<void>;
  updateSettings: (
    type: string,
    newSettings: Record<string, unknown>
  ) => Promise<void>;
}

let updateInProgress = false;

export const useProfileStore = create<SettingsState>()((set) => ({
  allSetting: {},
  profile: {},
  emails: [],
  load: false,
  fetchAllProfiles: async () => {
    try {
      const response = await api.get("/profile/all");
      set((s) => ({
        ...s,
        allSetting: response.data.setting,
        emails: response.data.emails,
        profile: response.data.profile,
        load: true,
      }));
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    }
  },
  updateSettings: async (type: string, newSettings) => {
    if (updateInProgress) return;

    console.log(type);

    updateInProgress = true;
    try {
      const token = localStorage.getItem("token");
      console.log(newSettings);

      const response = await api.put(`/profile/${type}`, newSettings, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        set((state) => ({
          ...state,
          allSetting: {
            ...state.allSetting,
            [type]: {
              ...state.allSetting[type],
              ...newSettings,
            },
          },
        }));
      } else {
        console.error(
          `Failed to update ${type} settings:`,
          response.data.message
        );
      }
    } catch (error) {
      console.error(`Failed to update ${type} settings:`, error);
    } finally {
      updateInProgress = false;
    }
  },
}));
