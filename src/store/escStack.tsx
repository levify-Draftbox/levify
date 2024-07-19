import { create } from 'zustand'

type EscKeyStore = {
    pushEsc: (key: string, func: () => void) => void,
    popEsc: () => (() => void) | undefined,
    escStack: { [_: string]: () => void }
}

const useEscKeyStore = create<EscKeyStore>()((set, get) => ({
    pushEsc: (key, fun) => {
        if (Object.keys(get().escStack).includes(key)) {
            console.warn("Not add in esc stack already exist");
            return
        }
        set((state) => ({ escStack: { ...state.escStack, [key]: fun } }))
    },
    popEsc: () => {
        let s = get().escStack
        const keys = Object.keys(s);
        if (keys.length === 0) return undefined;
        const lastKey = keys[keys.length - 1];
        const lastFun = s[lastKey]

        delete s[lastKey]

        return lastFun;
    },
    escStack: {}
}))

export default useEscKeyStore

