import { create } from 'zustand'

type ComposerStore = {
    newComposer: () => void
    composers: { [_: number]: any }
}

const useComposerStore = create<ComposerStore>()((set, get) => ({
    newComposer: async () => {

        if (Object.keys(get().composers).length  >= 3) {
            alert("No more")
            return
        } 

        set((s) => ({
            ...s,
            composers: {
                ...get().composers,
                [Object.keys(get().composers).length]: {}
            }
        }))
    },
    composers: []
}))

export default useComposerStore

