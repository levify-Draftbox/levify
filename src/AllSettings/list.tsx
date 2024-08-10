import Appearance from "./Appearance";
import Composer from "./Composer";
import Dashboard from "./dashboard";
import Notification from "./Notification";
import Privacy from "./Privacy";

type SettingsListType = {
  name: string;
  description?: string;
  component: React.ReactNode;
};

const SettingsList: {
  [_: string]: SettingsListType;
} = {
  dashboard: {
    name: "Dashboard",
    component: <Dashboard />,
  },
  plan: {
    name: "Your Plan",
    component: <>Your Plan!</>,
  },
  security: {
    name: "Security And 2FA",
    component: <>Active 2FAI!</>,
  },
  appearance: {
    name: "Appearance",
    description: "Personalize your workspace with custom themes and layouts.",
    component: <Appearance />,
  },
  notification: {
    name: "Notification",
    description:
      "The notification section allows users to manage their alert preferences",
    component: <Notification />,
  },
  Privacy: {
    name: "Privacy",
    description:
      "Privacy is key on our mail service site, protecting user data with robust security.",
    component: <Privacy />,
  },
  Compose: {
    name: "Compose",
    description:
      "Customize email composition preferences and settings.",
    component: <Composer />,
  },
  Filter: {
    name: "Filter",
    component: <>Filter And Sweep</>,
  },
  AutoReply: {
    name: "Auto Reply",
    component: <>FAuto Reply</>,
  },
  Blocking: {
    name: "Blocking",
    component: <>Blocking </>,
  },
  importAndExport: {
    name: "Filter",
    component: <>import And Export</>,
  },
  domains: {
    name: "Domains",
    component: <>domains</>,
  },
  GetTheApps: {
    name: "Get The Apps",
    component: <>GetTheApps</>,
  },
};

export default SettingsList;
