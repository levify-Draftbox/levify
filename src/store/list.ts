import { sendToWs } from '@/lib/ws'
import { Email, EmailObj } from '@/page/Inbox'
import { create } from 'zustand'

type MailList = {
    [_: string]: EmailObj[]
}

export type UnreadFunc = (_: { unread: boolean, email_id: number, thread_id: string, notify: boolean, path: string }) => void

type List = {
    setList: (log: string, list: EmailObj[]) => void,
    setUnread: UnreadFunc,
    appendMail: (path: string, mail: Email) => void,
    list: MailList
}

const useList = create<List>()((set) => ({
    setList: (path: string, list: EmailObj[]) => {
        console.log("Set list");

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
    setUnread: ({ notify, email_id, thread_id, unread, path }) => {
        if (notify) {
            sendToWs(
                JSON.stringify({
                    event: "unread",
                    data: {
                        thread_id: thread_id,
                        email_id: email_id,
                        unread: unread,
                        path: path,
                    },
                })
            );
        }

        set(s => {

            let list = s.list[path] || []
            list = list.map(eo => {
                if (eo.thread_id == thread_id) {
                    eo.emails = eo.emails.map(e => {
                        if (e.id == email_id) {
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
                    [path]: [
                        ...s.list[path] || [],
                        ...list
                    ]
                }
            }
        })
    },
    appendMail: (path: string, mail: Email) => {
        set(s => {

            let list = (s.list[path] || []).slice()

            const emailObj = list?.find(eo => eo.thread_id == mail.thread_id);
            mail.new = true;

            if (!emailObj) {
                list = [{
                    emails: [mail],
                    latest_date: mail.dateandtime,
                    subject: mail.b_subject,
                    thread_id: mail.thread_id,
                    unread: mail.unread
                }, ...list] as EmailObj[]

                console.log("new mail");


                return {
                    ...s,
                    list: {
                        ...s.list,
                        [path]: list
                    }
                }
            }

            let oldMailList = list.filter(eo => eo.thread_id != mail.thread_id)
            emailObj.emails.push(mail)
            emailObj.latest_date = mail.dateandtime
            emailObj.subject = mail.b_subject
            emailObj.unread = mail.unread

            console.log("new emails", emailObj);

            list = [emailObj, ...oldMailList]

            return {
                ...s,
                list: {
                    ...s.list,
                    [path]: list
                }
            }
        })
    },
    list: {

    }
}))

export default useList

