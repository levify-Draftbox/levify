import Dashboard from "./dashboard"

type SettingsListType = {
    name: string,
    component: React.ReactNode
}

const SettingsList: {
    [_: string]: SettingsListType
} = {
    dashboard: {
        name: "Dashboard",
        component: <Dashboard />
    },
    plan: {
        name: "Your Plan",
        component: <>Your Plan!</>
    },
    security: {
        name: "Security And 2FA",
        component:
            <>Active 2FAI!</>
    },
    appearance: {
        name: "Appearance And Feel",
        component:
            <>Look And Feel!</>
    }
}

export default SettingsList