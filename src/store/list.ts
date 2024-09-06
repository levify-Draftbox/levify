import api from '@/lib/api'
import { sendToWs } from '@/lib/ws'
import { Email, EmailObj } from '@/page/boxes'
import { toast } from 'sonner'
import { create } from 'zustand'
import useListState from './listState'

type MailList = {
    [_: string]: EmailObj[]
}

export type UnreadFunc = (_: { unread: boolean, notify: boolean, email: Email }) => void

type List = {
    setList: (log: string, list: EmailObj[]) => void,
    setUnread: UnreadFunc,
    appendMail: (paths: string[], emails: Email[], threadId: string) => void,
    loadMore: (path: string, cd: (err: any) => void) => void,
    clearList: (path: string) => void,
    list: MailList
}

const useList = create<List>()((set, get) => ({
    setList: (path: string, list: EmailObj[]) => {
        // console.log("Set list");

        set((s) => ({
            ...s,
            list: {
                ...s.list,
                [path]: [
                    ...s.list[path] || [],
                    ...list
                ]
            }
        }))
    },
    setUnread: ({ notify, email, unread }) => {
        if (email.unread == unread) return

        const { unreadCount, setUnreadCount } = useListState.getState()
        const unreadMsgs = unreadCount[email.path] || 0

        setUnreadCount(email.path, unreadMsgs + (unread ? 1 : -1))

        if (notify) {
            sendToWs(
                JSON.stringify({
                    event: "unread",
                    data: {
                        thread_id: email.thread_id,
                        id: email.id,
                        unread: unread,
                        path: email.path,
                    },
                })
            );
        }

        set(s => {

            let list = s.list[email.path] || []
            list = list.map(eo => {
                if (eo.thread_id == email.thread_id) {
                    eo.emails = eo.emails.map((e: Email) => {
                        if (e.id == email.id) {
                            e.unread = unread
                            e.new = false
                        }
                        return e
                    })
                }
                return eo
            })

            return {
                ...s,
                list: {
                    ...s.list,
                    [email.path]: list
                }
            }
        })
    },
    appendMail: (paths: string[], emails: Email[], threadId: string) => {
        const { openEmail, setOpenEmail, reverse: reverseObj, hasMore: hasMoreObj, unreadCount, setUnreadCount } = useListState.getState()
        let lastEmail = emails[emails.length - 1]
        let unreadMsgs = unreadCount[lastEmail.path] || 0
        setUnreadCount(lastEmail.path, unreadMsgs + 1)

        for (let path of paths) {
            let reverse = reverseObj[path] || false
            let hasMore = hasMoreObj[path] == undefined ? true : hasMoreObj[path]

            if (reverse && hasMore) {
                // TODO: add unread count
                if (openEmail && openEmail.thread_id == lastEmail.thread_id) {
                    setOpenEmail({
                        emails: emails,
                        latest_date: lastEmail.dateandtime,
                        subject: lastEmail.b_subject,
                        thread_id: lastEmail.thread_id,
                        unread: lastEmail.unread,
                        updated: true,
                    })
                }
                return
            }

            set(s => {
                let list = (s.list[path] || []).slice()

                const emailObj = list?.find(eo => eo.thread_id == threadId);
                lastEmail.new = true;

                if (!emailObj) {

                    let newMailObj: EmailObj = {
                        emails: emails,
                        latest_date: lastEmail.dateandtime,
                        subject: lastEmail.b_subject,
                        thread_id: lastEmail.thread_id,
                        unread: lastEmail.unread,
                        updated: false,
                    }
                    list = !reverse ? [newMailObj, ...list] : [...list, newMailObj] as EmailObj[]

                    return {
                        ...s,
                        list: {
                            ...s.list,
                            [path]: list
                        }
                    }
                }

                let oldMailList = list.filter(eo => eo.thread_id != threadId)
                emailObj.emails = emails
                emailObj.latest_date = lastEmail.dateandtime
                emailObj.subject = lastEmail.b_subject
                emailObj.unread = lastEmail.unread

                list = !reverse ? [emailObj, ...oldMailList] : [...oldMailList, emailObj]

                if (emailObj.thread_id == openEmail?.thread_id) {
                    // if open mail and incoming new mail thread id 
                    // same than set email obj into here
                    setOpenEmail({ ...emailObj, updated: true })
                }

                return {
                    ...s,
                    list: {
                        ...s.list,
                        [path]: list
                    }
                }
            })
        }
    },
    loadMore: async (path: string, cd: Function) => {
        let { list: emailListObj, setList } = get()
        let emailList = emailListObj[path] || []
        let { setListMore, reverse: reverseObj } = useListState.getState()
        let reverse = reverseObj[path] || false

        try {
            const res = await api.post<{ hasMore: boolean; emails: EmailObj[] }>(
                "/listing",
                {
                    offset: emailList.length,
                    path: path,
                    reverse: reverse,
                }
            );
            setList(path, res.data.emails)
            setListMore(path, res.data.hasMore)

            cd(false);
        } catch (error) {
            console.error("Error fetching emails:", error);
            toast.error("Failed to fetch emails. Please try again.");

            cd(error)
        }
    },
    clearList: (path: string) => {
        set(s => {
            return {
                ...s,
                list: {
                    ...s.list,
                    [path]: []
                }
            }
        })
    },
    list: {}
}))

export default useList

