import ToolBar from "@/components/ToolBar";
import api from "@/lib/api";
import { useVirtual } from "react-virtual";
import React, { useCallback, useEffect, useRef, useState } from "react";
import MailRow from "@/components/MailRow";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { sendToWs, setNotifyFunc, setUnReadFunc } from "@/lib/ws";
import { toast } from "sonner";
import { useProfileStore } from "@/store/profile";
import { Spinner } from "@/components/Spinner";
import useloadInboxModal from "@/store/loadinbox";
import { motion, AnimatePresence } from "framer-motion";
import {
  AddressBookTabs,
  ArrowBendDoubleUpLeft,
  ArrowBendUpLeft,
  ArrowBendUpRight,
  EnvelopeSimple,
  X,
} from "@phosphor-icons/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import moment from "moment";

// TODO: move to type file
export type Email = {
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
  thread_id: string;
};

export type EmailObj = {
  thread_id: string,
  unread: boolean,
  subject: string,
  latest_date: string,
  emails: Email[]
}

const Inbox: React.FC = () => {
  const parentRef = useRef<HTMLDivElement>(null);

  const [emailList, setEmailList] = useState<EmailObj[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const { allSetting } = useProfileStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { setLoad: setLoadInbox } = useloadInboxModal();

  function playSound() {
    const notificationSound = new Audio(
      allSetting?.notification?.notificationSound || ""
    );
    notificationSound.play().catch((error) => {
      console.error("Error playing sound:", error);
    });
  }

  useEffect(() => {
    setUnReadFunc((_) => {
      // const { email_id, unread } = d as { email_id: number; unread: boolean };
      // setUnread(email_id, unread);
    });

    setNotifyFunc((d) => {
      const { mode, notify, mail } = d as {
        mode: "append" | "remove";
        notify: boolean;
        mail: Email;
      };

      if (mode == "append") {
        setEmailList((l) => {
          const emailObj = l.find(eo => eo.thread_id == mail.thread_id);
          if (!emailObj) {
            return [{
              emails: [mail],
              latest_date: mail.dateandtime,
              subject: mail.b_subject,
              thread_id: mail.thread_id,
              unread: mail.unread
            }, ...l] as EmailObj[]
          }

          let oldMailList = l.filter(eo => eo.thread_id != mail.thread_id)
          emailObj.emails.push(mail)
          emailObj.latest_date = mail.dateandtime
          emailObj.subject = mail.b_subject
          emailObj.unread = mail.unread

          return [emailObj, ...oldMailList]
        });

        if (notify) {
          if (document.hasFocus()) {
            toast.success(`New message from: ${mail.b_from}`, {
              description: mail.b_subject,
            });
          } else {
            const n = new Notification(`From: ${mail.b_from}`, {
              body: mail.b_subject,
              icon: "/favicon.png",
            });
            n.onclick = () => {
              console.log("Click");
            };
          }
          playSound();
        }
      } else {
        // TODO:
      }
    });
  }, []);

  const setUnread = (threadId: string, unread: boolean) => {
    setEmailList((e) =>
      e.map((eo) => {
        if (eo.thread_id === threadId) {
          return { ...eo, unread };
        }
        return eo;
      })
    );
  };

  const renderEmail = (index: number) => {
    if (index >= emailList.length) {
      return (
        <div className="my-6 flex justify-center w-full">
          <Spinner size={30} />
        </div>
      );
    }

    const e = emailList[index];
    const isSelected = openEmail?.thread_id === e.thread_id;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <MailRow
          onClick={() => {
            setEmailOpen(true);
            setOpenEmail(e);
            setUnread(e.thread_id, false);
          }}

          datetime={e.latest_date}
          text={e.emails[0].b_text}
          unread={e.unread}
          subject={e.subject}
          count={e.emails.length}
          fromNames={e.emails.map(e => ({
            email: e.b_from,
            name: e.b_from_name,
            profile: e.from_profile,
          }))}

          className={
            isSelected
              ? "bg-[rgba(0,0,0,0.04)] dark:bg-[rgba(255,255,255,0.08)]"
              : ""
          }
        />
      </motion.div>
    );
  };

  const rowVirtualizer = useVirtual({
    size: hasMore ? emailList.length + 1 : emailList.length,
    parentRef,
    estimateSize: React.useCallback(() => 100, []),
  });

  // TODO: implement react query!
  const isFetchingRef = useRef(false);

  const fetchEmails = async (isRefresh = false) => {
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setIsLoading(true);
    try {
      const res = await api.post<{ hasMore: boolean; emails: EmailObj[] }>(
        "/listing",
        { page: isRefresh ? 1 : page }
      );
      if (isRefresh) {
        setEmailList(res.data.emails);
        setPage(2);
      } else {
        setEmailList((prevEmails) => [...prevEmails, ...res.data.emails]);
        setPage((prevPage) => prevPage + 1);
      }
      setHasMore(res.data.hasMore);
      setLoadInbox();
    } catch (error) {
      console.error("Error fetching emails:", error);
      toast.error("Failed to fetch emails. Please try again.");
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
      if (isRefresh) {
        setIsRefreshing(false);
      }
    }
  };

  useEffect(() => {
    const [lastItem] = rowVirtualizer.virtualItems.slice(-1);
    if (
      lastItem &&
      lastItem.index >= emailList.length - 1 &&
      hasMore &&
      !isLoading
    ) {
      fetchEmails();
    }
  }, [rowVirtualizer.virtualItems, hasMore, isLoading, emailList.length]);

  const [emailOpen, setEmailOpen] = useState(false);
  const [openEmail, setOpenEmail] = useState<EmailObj | undefined>();

  const handleClose = () => {
    setEmailOpen(!emailOpen);
  };

  const refreshEmails = useCallback(() => {
    setIsRefreshing(true);
    fetchEmails(true);
  }, []);

  const [htmlViewWidth, setHtmlViewWidth] = useState(50)

  return (
    <motion.div className="w-full flex flex-col flex-1 overflow-hidden">
      <ToolBar
        className={""}
        onRefresh={refreshEmails}
        isRefreshing={isRefreshing}
      />

      <ResizablePanelGroup
        direction="horizontal"
        className="max-w-full !flex-1 !h-full"
      >
        <AnimatePresence>
          <ResizablePanel className="!overflow-hidden h-full">
            <motion.div className="bg-inbox-bg !overflow-hidden h-full">
              <div
                className="h-full w-full overflow-auto scroll-bar"
                ref={parentRef}
              >
                <div
                  className="scroll-bar w-full relative"
                  style={{
                    height: `${rowVirtualizer.totalSize}px`,
                  }}
                >
                  {rowVirtualizer.virtualItems.map((virtualRow) => (
                    <div
                      key={virtualRow.index}
                      ref={virtualRow.measureRef}
                      className="absolute top-0 left-0 w-full"
                      style={{
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                    >
                      {renderEmail(virtualRow.index)}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </ResizablePanel>
        </AnimatePresence>

        <ResizableHandle />

        <AnimatePresence>
          {emailOpen && (
            <ResizablePanel minSize={30} maxSize={65} defaultSize={htmlViewWidth} onResize={(e) => setHtmlViewWidth(e)}>
              <div
                // initial={{ x: 100, opacity: 0 }}
                // animate={{ x: 0, opacity: 1 }}
                // exit={{ x: 100, opacity: 0 }}
                // transition={{
                //   type: "spring",
                //   stiffness: 300,
                //   damping: 30,
                //   duration: 0.5,
                // }}
                className="!h-full"
              >
                <MailViewer
                  key={openEmail?.thread_id || ""}
                  emails={openEmail as EmailObj}
                  onClose={handleClose}
                  width={htmlViewWidth}
                />
              </div>
            </ResizablePanel>
          )}
        </AnimatePresence>
      </ResizablePanelGroup>
    </motion.div>
  );
};

const MailViewer: React.FC<{
  emails: EmailObj;
  key: number | string;
  onClose: () => void;
  width: number;
}> = ({ emails, onClose, width: htmlWidth }) => {

  let e = emails.emails[0]

  useEffect(() => {
    sendToWs(
      JSON.stringify({
        event: "unread",
        data: {
          email_id: e.id,
          unread: false,
        },
      })
    );
  }, []);

  return (
    <div className="p-2 h-full overflow-auto scroll-bar">
      <div className="flex w-full justify-between my-1 items-center">
        <div className="flex-1">
          <h1 className="text-xl font-medium text-start line-clamp-2" title={e.b_subject}>
            {e.b_subject}
          </h1>
        </div>
        <div>
          <Button variant={"toolbutton"} onClick={onClose}>
            <X size={18} />
          </Button>
        </div>
      </div>

      <EmailBlock {...e} panelWidth={htmlWidth} />

    </div>
  );
};

const EmailBlock = (e: Email & { panelWidth: number }) => {
  const viewMode = e.b_html && e.b_html !== "" ? "html" : "text"
  const htmlView = useRef<HTMLIFrameElement>(null);
  const [emailHeight, setEmailHeight] = useState<number>(10)

  const injectCSS = () => {
    if (htmlView.current) {
      const d =
        htmlView.current.contentWindow?.document ||
        htmlView.current.contentDocument;

      if (d) {
        const styleElement = d.createElement('style');
        styleElement.innerHTML = `
            body::-webkit-scrollbar { 
              display: none; 
            }
            body {
              -ms-overflow-style: none;  /* IE and Edge */
              scrollbar-width: none;  /* Firefox */
            }
          `;
        d.head.appendChild(styleElement);
      }
    }
  };

  const updateHeight = () => {
    if (htmlView.current) {
      const d =
        htmlView.current.contentWindow?.document ||
        htmlView.current.contentDocument;

      if (d) {
        const newHeight = d.body.scrollHeight || d.documentElement.scrollHeight;
        setEmailHeight(newHeight > 0 ? newHeight : 300); // Fallback to 300px if height is 0
      }
    }
  };

  useEffect(() => {
    const observeImages = (document: Document) => {
      const images = document.querySelectorAll('img');
      images.forEach((img) => {
        img.addEventListener('load', updateHeight);
        img.addEventListener('error', updateHeight); // Handle errors
      });
    };

    const initializeIframe = () => {
      if (htmlView.current) {
        const d =
          htmlView.current.contentWindow?.document ||
          htmlView.current.contentDocument;

        if (d) {
          d.open();
          d.write(e.b_html); // Assuming e.b_html contains the HTML content
          d.close();

          observeImages(d); // Attach listeners to images for dynamic height adjustment
          updateHeight(); // Initial height adjustment
        }
      }
    };

    initializeIframe();

    // Adjust height on window resize
    window.addEventListener('resize', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);

      // Cleanup image load listeners
      if (htmlView.current) {
        const d =
          htmlView.current.contentWindow?.document ||
          htmlView.current.contentDocument;
        if (d) {
          const images = d.querySelectorAll('img');
          images.forEach((img) => {
            img.removeEventListener('load', updateHeight);
            img.removeEventListener('error', updateHeight);
          });
        }
      }
    };
  }, [viewMode, e.panelWidth]);

  useEffect(() => injectCSS(), [])

  return (
    <>
      <div className="flex justify-between">
        <div className="my-2 flex gap-3">
          <img
            className="w-12 h-12 rounded-md"
            src={e.from_profile}
            alt={e.b_from_name || e.b_from.split("@")[0]}
            title={e.b_from_name || e.b_from.split("@")[0]}
          />
          <div>
            <HoverCard>
              <HoverCardTrigger>
                <h2 className="font-medium cursor-pointer">
                  {e.b_from_name || e.b_from}
                </h2>
              </HoverCardTrigger>
              <HoverCardContent className="w-fit">
                <div className="flex gap-3 items-center">
                  <Avatar className="w-14 h-14">
                    <AvatarImage src={e.from_profile} />
                    <AvatarFallback>
                      {e.b_from_name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {e.b_from_name || e.b_from.split("@")[0]}
                    </p>
                    <p className="text-sm">{e.b_from || "unknown"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Button variant="primary" className="gap-2  w-full ">
                    <ArrowBendUpLeft size={18} />
                    <p>Reply</p>
                  </Button>
                  <Tooltip tip="Send mail">
                    <Button variant={"secondary"}>
                      <EnvelopeSimple size={18} />
                    </Button>
                  </Tooltip>
                  <Tooltip tip="Add to contact">
                    <Button variant={"secondary"}>
                      <AddressBookTabs size={18} />
                    </Button>
                  </Tooltip>
                </div>
              </HoverCardContent>
            </HoverCard>
            <div className="flex items-center gap-2 text-[rgba(0,0,0,0.5)] dark:text-[rgba(255,255,255,0.5)]">
              <p className="text-sm">To:</p>
              {e.b_to.map((recipient, index) => (
                <HoverCard key={index}>
                  <HoverCardTrigger>
                    <Badge
                      variant="secondary"
                      className="text-sm cursor-pointer"
                    >
                      {recipient}
                    </Badge>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-fit">
                    <div className="flex gap-3  items-center">
                      <Avatar className="w-14 h-14">
                        <AvatarImage src={`/api/placeholder/32/32`} />
                        <AvatarFallback>{recipient.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium">
                          {recipient.split("@")[0]}
                        </p>
                        <p className="text-sm ">{recipient}</p>
                      </div>
                    </div>

                    <div className="mt-3 flex gap-2">
                      <div className="flex items-center gap-2 mt-3">
                        <Button variant="primary" className="gap-2  w-full ">
                          <ArrowBendUpLeft size={18} />
                          <p>Reply</p>
                        </Button>
                        <Tooltip tip="Send mail">
                          <Button variant={"secondary"}>
                            <EnvelopeSimple size={18} />
                          </Button>
                        </Tooltip>
                        <Tooltip tip="Add to contact">
                          <Button variant={"secondary"}>
                            <AddressBookTabs size={18} />
                          </Button>
                        </Tooltip>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          </div>
        </div>
        <div>
          <p className="text-[rgba(0,0,0,0.5)] mt-3 dark:text-[rgba(255,255,255,0.5)] text-sm">
            {moment(e.b_datetime).format("lll")}
          </p>
        </div>
      </div>

      <div className="mt-2 shadow">
        {viewMode === "text" ? (
          <pre className="font-sans bg-white text-black rounded-md p-4" style={{
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
          }}>
            {e.b_text}
          </pre>
        ) : (
          <iframe
            style={{
              height: emailHeight
            }}
            className="bg-white w-full h-[500px] rounded-md overflow-hidden"
            ref={htmlView}
            scrolling="no"
          />
        )}
      </div>
      <div className="mx-1 mt-4 flex gap-2">
        <Button variant={"primary"} className="gap-2 ">
          <ArrowBendUpLeft size={18} />
          <p>Reply</p>
        </Button>
        <Button variant={"secondary"}>
          <ArrowBendDoubleUpLeft size={18} />
          <p>Reply All</p>
        </Button>
        <Button variant={"secondary"}>
          <ArrowBendUpRight size={18} />
          <p>Forward</p>
        </Button>
      </div>

    </>
  )
}

export default Inbox;
