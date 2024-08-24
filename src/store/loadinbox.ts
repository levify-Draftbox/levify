import { create } from 'zustand'

type loadInboxModal = {
    setLoad: () => void,
    load: boolean
}

const useloadInboxModal = create<loadInboxModal>()((set) => ({
    setLoad: () => {
        set(() => ({ load: true }))
    },
    load: false
}))

export default useloadInboxModal

