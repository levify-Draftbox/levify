import { EmailObj } from '@/page/boxes'
import { create } from 'zustand'

type EmailListPos = {
    [_: string]: number
}

type EmailListMore = {
    [_: string]: boolean
}

type EmailListReverse = {
    [_: string]: boolean
}

type List = {
    setListPos: (path: string, pos: number) => void,
    setListMore: (path: string, v: boolean) => void,
    setOpenEmail: (v: EmailObj | undefined) => void,
    setReverse: (path: string, v: boolean) => void,
    listPos: EmailListPos,
    hasMore: EmailListMore,
    openEmail: EmailObj | undefined,
    reverse: EmailListReverse,
}

const useListState = create<List>()((set) => ({
    setListPos: (path, pos) => {
        set(s => ({
            ...s,
            listPos: {
                ...s.listPos,
                [path]: pos
            }
        }))
    },
    setListMore: (path, v) => {
        set(s => ({
            ...s,
            hasMore: {
                ...s.hasMore,
                [path]: v
            }
        }))
    },
    setOpenEmail: (v) => {
        v = structuredClone(v)
        set(s => ({
            ...s,
            openEmail: v
        }))
    },
    setReverse: (path, v) => {
        set(s => ({
            ...s,
            reverse: {
                ...s.reverse,
                [path]: v
            }
        }))
    },
    listPos: {},
    hasMore: {},
    openEmail: undefined,
    reverse: {},
}))

export default useListState
