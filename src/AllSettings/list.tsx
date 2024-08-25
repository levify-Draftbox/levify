import Appearance from "./Appearance";
import Composer from "./Composer";
import LanguageAndTime from "./LanguageAndTime";
import Notification from "./Notification";
import Privacy from "./Privacy";
import Profile from "./Profile";

type SettingsListType = {
  name: string;
  description?: string;
  component: React.ReactNode;
};

const SettingsList: {
  [_: string]: SettingsListType;
} = {
  profile: {
    name: "Profile",
    description: "Update your personal details and account settings here.",
    component: <Profile />,
  },
  plan: {
    name: "Your Plan",
    component: <>Your Plan!</>,
  },
  LanguageAndTime: {
    name: "Language and Time",
    description: "Set your language and time zone for a tailored website experience.",
    component: <LanguageAndTime />,
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
  Composer: {
    name: "Composer",
    description: "Customize email composition preferences and settings.",
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
