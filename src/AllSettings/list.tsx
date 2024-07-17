import Appearance from "./Appearance";
import Dashboard from "./dashboard";

type SettingsListType = {
  name: string;
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
    name: "Appearance And Feel",
    component: <Appearance />,
  },
  notification: {
    name: "notification",
    component: <>notification</>,
  },
  Privacy: {
    name: "Privacy",
    component: <>Privacy</>,
  },
  Compose: {
    name: "Compose",
    component: <>Compose</>,
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
