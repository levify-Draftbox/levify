import ToolBar from "@/components/ToolBar";
import api from "@/lib/api";
import { useVirtual } from 'react-virtual';
import React, { useEffect, useRef, useState } from "react";
import MailRow from "@/components/MailRow";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { sendToWs, setNotifyFunc, setUnReadFunc } from "@/lib/ws";
import { toast } from "sonner";
import { useProfileStore } from "@/store/profile";
import { Spinner } from "@/components/Spinner";

// TODO: move to type file
export type EmailObject = {
  id: number;
  uid: string;
  dateandtime: string;
  from: string;
  to: string[];
  b_datetime: string;
  b_from: string;
  b_from_name: string;
  b_to: string[];
  b_cc: string[];
  b_subject: string;
  b_text: string;
  b_html: string;
  mode: "receive" | "send";
  path: "inbox" | "sent" | "drafts" | "trash" | string;
  unread: boolean;

  from_profile: string;
};

const Inbox = () => {
  const parentRef = useRef(null);
  const [emailList, setEmailList] = useState<EmailObject[]>([])
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const { allSetting } = useProfileStore()

  function playSound() {
    const notificationSound = new Audio(allSetting?.notification?.notificationSound);
    notificationSound.play().catch(error => {
      console.error('Error playing sound:', error);
    });
  };

  useEffect(() => {
    setUnReadFunc((d) => {
      const { email_id, unread } = d as { email_id: number, unread: boolean }
      setUnread(email_id, unread)
    })

    setNotifyFunc(d => {
      let { mode, notify, mail } = d as {
        mode: "append" | "remove",
        notify: boolean,
        mail: EmailObject
      }

      if (mode == "append") {
        setEmailList(l => [mail, ...l])
        if (notify) {
          toast.success("One new mail recive")
          playSound()
        }
      } else {
        // TODO:
      }
    })
  }, [])


  const setUnread = (email_id: number, unread: boolean) => {
    setEmailList(e => e.map(e => {
      e.unread = e.id == email_id ? unread : e.unread
      return e
    }))
  }

  const renderEmail = (index: number) => {
    if (index >= emailList.length) {
      return (
        <div className="mt-6 flex justify-center w-full">
          <Spinner size={30}/>
        </div>
      );
    }

    const email = emailList[index];
    return <MailRow onClick={() => {
      setEmailOpen(true)
      setOpenEmailId(index)
      setUnread(email.id, false)
    }} {...email} />
  };

  const rowVirtualizer = useVirtual({
    size: hasMore ? emailList.length + 1 : emailList.length,
    parentRef,
    estimateSize: React.useCallback(() => 100, []),
  });

  // TODO: implement react query!
  const isFetchingRef = useRef(false);

  const fetchEmails = async () => {
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setIsLoading(true);
    try {
      let res = await api.post<{ hasMore: boolean, emails: EmailObject[] }>("/listing", { page });
      setEmailList(prevEmails => [...prevEmails, ...res.data.emails]);
      setHasMore(res.data.hasMore);
      setPage(prevPage => prevPage + 1);
    } catch (error) {
      console.error('Error fetching emails:', error);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    const [lastItem] = rowVirtualizer.virtualItems.slice(-1);
    if (lastItem && lastItem.index >= emailList.length - 1 && hasMore && !isLoading) {
      fetchEmails();
    }
  }, [rowVirtualizer.virtualItems, hasMore, isLoading, emailList.length]);

  const [emailOpen, setEmailOpen] = useState(false)
  const [openEmailId, setOpenEmailId] = useState(0)

  return (
    <div className="w-full flex flex-col flex-1 overflow-hidden">
      <ToolBar className={""} />

      <ResizablePanelGroup
        direction="horizontal"
        className="max-w-full !flex-1 !h-full"
      >
        <ResizablePanel className="!overflow-hidden h-full">
          <div className="bg-inbox-bg !overflow-hidden h-full">
            <div
              className="scroll-bar"
              ref={parentRef}
              style={{
                height: `100%`,
                width: `100%`,
                overflow: 'auto',
              }}
            >
              <div
                className="scroll-bar"
                style={{
                  height: `${rowVirtualizer.totalSize}px`,
                  width: '100%',
                  position: 'relative',
                }}
              >
                {rowVirtualizer.virtualItems.map(virtualRow => (
                  <div
                    key={virtualRow.index}
                    ref={virtualRow.measureRef}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    {renderEmail(virtualRow.index)}
                  </div>
                ))}
              </div>

            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle />

        {
          emailOpen &&
          <>
            <ResizablePanel minSize={30} maxSize={55} defaultSize={20} >
              <MailViewer key={openEmailId} email={emailList[openEmailId]} />
            </ResizablePanel>
          </>
        }

      </ResizablePanelGroup>
    </div>
  );
};

const MailViewer: React.FC<{ email: EmailObject, key: number }> = ({ email, key }) => {

  const [viewMode, setViewMode] = useState(email.b_html && email.b_html != "" ? "html" : "text")
  const htmlView = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (htmlView.current) {
      let d = htmlView.current.contentWindow?.document ||
        htmlView.current.contentDocument;

      d?.open();
      d?.write(email.b_html);
      d?.close();
    }
  }, [viewMode, key])

  useEffect(() => {
    sendToWs(JSON.stringify({
      event: "unread",
      data: {
        email_id: email.id,
        unread: false
      }
    }))
  }, [])

  return (
    <div className="p-2">
      <h1>From: {email.b_from_name || ""} {email.from}</h1>
      <h1>To: {email.to.join(",")}</h1>

      <hr className="my-2" />

      <Button className="w-fit" variant={viewMode == "html" ? "secondary" : "primary"} onClick={() => setViewMode(v => v == "html" ? "text" : "html")}>
        <span className="capitalize">
          {viewMode == "html" ? "Text" : "HTML"}
        </span>
      </Button>

      <hr className="my-2" />
      {
        viewMode == "text" ?
          <pre className="text-sm">
            {email.b_text}
          </pre>
          :
          <iframe className="bg-white w-full h-[500px]" ref={htmlView} />
      }

    </div>
  )
}

export default Inbox;
