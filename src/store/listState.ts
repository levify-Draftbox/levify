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

type UnreadCount = {
    [path: string]: number
}

export type ListCategoryType = "all" | "read" | "unread" | "file"
type ListCategory = {
    [path: string]: ListCategoryType
}

type List = {
    setListPos: (path: string, pos: number) => void,
    setListMore: (path: string, v: boolean) => void,
    setOpenEmail: (v: EmailObj | undefined) => void,
    setReverse: (path: string, v: boolean) => void,
    setUnreadCount: (path: string, v: number) => void,
    setAllUnreadCount: (counts: UnreadCount) => void,
    setListCategory: (path: string, catogory: ListCategoryType) => void,
    listPos: EmailListPos,
    hasMore: EmailListMore,
    openEmail: EmailObj | undefined,
    reverse: EmailListReverse,
    unreadCount: UnreadCount,
    listCategory: ListCategory,
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
    setUnreadCount: (path, v) => {
        set(s => ({
            ...s,
            unreadCount: {
                ...s.unreadCount,
                [path]: v
            }
        }))
    },
    setAllUnreadCount: (counts) => {
        set(s => ({
            ...s,
            unreadCount: counts,
        }))
    },
    setListCategory: (path, category) => {
        set(s => ({
            ...s,
            listCategory: {
                ...s.listCategory,
                [path]: category,
            }
        }))
    },
    listPos: {},
    hasMore: {},
    openEmail: undefined,
    reverse: {},
    unreadCount: {},
    listCategory: {},
}))

export default useListState
