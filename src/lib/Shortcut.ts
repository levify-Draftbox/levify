import useEscKeyStore from "@/store/escStack"
import { useHotkeys } from "react-hotkeys-hook"

const ShortcutLoad = () => {

    const { popEsc } = useEscKeyStore()

    useHotkeys('ctrl+k', (e) => {
        e.preventDefault()
        console.log("press ctl+k");
    })

    useHotkeys('esc', (e) => {
        e.preventDefault()
        const ecsFunc = popEsc()
        console.log(ecsFunc);
        ecsFunc && ecsFunc()
    })
}

export default ShortcutLoad