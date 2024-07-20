import { SettingDiv, SettingTitle } from "./components"

const Notification = () => {
  return (
    <div className="w-full h-full">
        <SettingTitle>Notification Sound</SettingTitle>
        <SettingDiv>sounds</SettingDiv>

        <SettingTitle>Desktop notifications</SettingTitle>
        <SettingDiv>sounds</SettingDiv>
    </div>
  )
}

export default Notification