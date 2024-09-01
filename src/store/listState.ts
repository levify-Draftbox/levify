import { create } from 'zustand'

type MailListPos = {
    [_: string]: number
}

type MailListMore = {
    [_: string]: boolean
}

type List = {
    setListPos: (path: string, pos: number) => void,
    setListMore: (pathth: string, v: boolean) => void,
    listPos: MailListPos,
    hasMore: MailListMore,
}

const useListState = create<List>()((set) => ({
    setListPos: (path: string, pos: number) => {
        set(s => ({
            ...s,
            listPos: {
                ...s.listPos,
                [path]: pos
            }
        }))
    },
    setListMore: (path: string, v: boolean) => {
        set(s => ({
            ...s,
            hasMore: {
                ...s.hasMore,
                [path]: v
            }
        }))
    },
    listPos: {},
    hasMore: {}
}))

export default useListState
