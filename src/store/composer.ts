import { create } from 'zustand'

type ComposerStates = {
    x: Number
    z: Number
    fullScreen: boolean
}

type ComposerStore = {
    newComposer: () => void
    removeComposer: (id: string) => void
    setComposer: (id: string, s: Partial<ComposerStates>) => void,
    setActive: (id: string) => void,
    incIndex: (id: string) => void,

    composers: { [_: string]: ComposerStates | undefined },
    activeid: string,
    currentZ: number
}

const useComposerStore = create<ComposerStore>()((set, get) => ({
    newComposer: async () => {
        const composers = get().composers
        let total = 0
        Object.keys(composers).map((i: any) => {
            if (composers[i]) {
                total++
            }
        })

        if (total >= 3) {
            alert("No more")
            return
        }

        set((s) => ({
            ...s,
            composers: {
                ...get().composers,
                [Object.keys(get().composers).length]: {
                    fullScreen: false,
                    x: 0,
                    z: s.currentZ + 1
                }
            },
            activeid: Object.keys(get().composers).length.toString(),
            currentZ: s.currentZ + 1
        }))
    },

    setComposer: (id, s) => {
        const composers = get().composers
        composers[id] ? composers[id] = {
            ...composers[id],
            ...s
        } : undefined
        set(s => ({ ...s, composers: composers }))
    },

    setActive: (id: string) => {
        set(s => ({ ...s, activeid: id }))
    },

    incIndex: (id: string) => {
        const composers = get().composers
        composers[id] ? composers[id] = {
            ...composers[id],
            z: get().currentZ + 1
        } : undefined
        set(s => ({ ...s, composers: composers, currentZ: s.currentZ + 1 }))
    },

    removeComposer: (id: string) => {
        const composers = get().composers
        composers[id] = undefined
        set(s => ({ ...s, composers: composers }))
    },
    composers: {},
    activeid: "",
    currentZ: 499
}))

export default useComposerStore

