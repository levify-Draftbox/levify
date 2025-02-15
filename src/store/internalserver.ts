import { create } from 'zustand'

type InterServerModal = {
    toggleModal: () => void,
    open: boolean
}

const useInterServerModal = create<InterServerModal>()((set) => ({
    toggleModal: () => {
        set((state) => ({ open: !state.open }))
    },
    open: false
}))

export default useInterServerModal

