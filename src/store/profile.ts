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
    newSettings: Record<string, any>
  ) => Promise<void>;
  updateProfile: (
    type: string,
    newProfile: Record<string, any>
  ) => Promise<void>;
}

// let updateInProgress = false;

export const useProfileStore = create<SettingsState>()((set) => ({
  allSetting: {},
  profile: {},
  emails: [],
  load: false,
  fetchAllProfiles: async () => {
    try {
      const response = await api.get("/profile/all");
      console.log("database image",response.data.setting.profile.image);
      
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

    try {
      console.log(newSettings);

      const response = await api.put(`/profile/${type}`, newSettings, {});

      if (response.data.success) {
        //
      } else {
        console.error(
          `Failed to update ${type} settings:`,
          response.data.message
        );
      }
    } catch (error) {
      console.error(`Failed to update ${type} settings:`, error);
    }
  },

  updateProfile: async (type: string = "profile", newPofile) => {
    set((state) => ({
      ...state,
      profile: {
        ...state.profile,
        ...newPofile,
      },
    }));

    try {
      const response = await api.put(`/profile/${type}`, newPofile, {});

      if (response.data.success) {
        //
      } else {
        console.error(
          `Failed to update ${type} settings:`,
          response.data.message
        );
      }
    } catch (error) {
      console.error(`Failed to update ${type} settings:`, error);
    }
  },
}));
