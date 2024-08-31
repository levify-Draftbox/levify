import { create } from 'zustand'

type MailListPos = {
    [_: string]: number
}

type List = {
    setListPos: (th: string, pos: number) => void,
    listPos: MailListPos
}

const useListPos = create<List>()((set) => ({
    setListPos: (path: string, pos: number) => {
        set(s => ({
            ...s,
            listPos: {
                ...s.listPos,
                [path]: pos
            }
        }))
    },
    listPos: {
        inbox: 0
    }
}))

export default useListPos
