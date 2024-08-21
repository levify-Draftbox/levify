import { create } from "zustand";
import api from "@/lib/api";

interface SettingsState {
  allSetting: { [_: string]: any }
  emails: string[]
  fetchAllProfiles: () => Promise<void>;
  updateSettings: (
    type: string,
    newSettings: Record<string, unknown>
  ) => Promise<void>;
}

let updateInProgress = false;

export const useProfileStore = create<SettingsState>()((set) => ({
  allSetting: {},
  emails: [],
  fetchAllProfiles: async () => {
    try {
      const response = await api.get("/setting/all");
      set(s => ({
        ...s,
        allSetting: response.data.setting,
        emails: response.data.emails
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
      
      const response = await api.put(`/setting/${type}`, newSettings, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      console.log(response);
      

      if (response.data.success) {
        set((state) => ({
          ...state,
          allSetting: {
            ...state.allSetting,
            [type]: {
              ...state.allSetting[type],
              ...newSettings
            }
          }
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
