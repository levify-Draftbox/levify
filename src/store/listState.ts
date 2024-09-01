import { EmailObj } from '@/page/boxes'
import { create } from 'zustand'

type MailListPos = {
    [_: string]: number
}

type MailListMore = {
    [_: string]: boolean
}

type OpenMail = {
    [_: string]: EmailObj | undefined
}

type List = {
    setListPos: (path: string, pos: number) => void,
    setListMore: (path: string, v: boolean) => void,
    setOpenEmail: (path: string, v: EmailObj | undefined) => void,
    listPos: MailListPos,
    hasMore: MailListMore,
    openEmail: OpenMail,
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
    setOpenEmail: (path: string, v: EmailObj | undefined) => {
        set(s => ({
            ...s,
            openEmail: {
                ...s.openEmail,
                [path]: v
            }
        }))
    },
    listPos: {},
    hasMore: {},
    openEmail: {},
}))

export default useListState
