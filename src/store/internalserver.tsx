import { create } from 'zustand'

type InterServerModal = {
    toggleModal: () => void,
    open: boolean
}

const useInterServerModal = create<InterServerModal>()((set, get) => ({
    toggleModal: () => {
        set((state) => ({ open: !state.open }))
    },
    open: true
}))

export default useInterServerModal

