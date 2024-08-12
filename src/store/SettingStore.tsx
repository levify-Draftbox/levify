import create from "zustand";
import api from "@/lib/api";

interface SettingsState {
  appearance: Record<string, unknown>;
  notification: Record<string, unknown>;
  privacy: Record<string, unknown>;
  compose: Record<string, unknown>;
  fetchAllSettings: () => Promise<void>;
  updateSetting: (
    type: string,
    newSettings: Record<string, unknown>
  ) => Promise<void>;
}

let updateInProgress = false; 

export const useSettingsStore = create<SettingsState>((set) => ({
  appearance: {},
  notification: {},
  privacy: {},
  compose: {},
  fetchAllSettings: async () => {
    try {
      const response = await api.get("/setting/all");

      console.log(response);
      
      if (response.data.success) {
        set({
          appearance: response.data.settings.appearance || {},
          notification: response.data.settings.notification || {},
          privacy: response.data.settings.privacy || {},
          compose: response.data.settings.compose || {},
        });
      } else {
        console.error("Failed to fetch settings:", response.data.message);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    }
  },
  updateSetting: async (type, newSettings) => {
    // Prevent concurrent updates
    if (updateInProgress) return;

    updateInProgress = true;
    try {
      const token = localStorage.getItem("token");
      const response = await api.put(`/setting/${type}`, newSettings, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        set((state) => ({
          ...state,
          [type]: { ...state[type], ...newSettings },
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
