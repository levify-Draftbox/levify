import ToolBar from "@/components/ToolBar";
import api from "@/lib/api";
import { useVirtual } from "react-virtual";
import React, { useEffect, useRef, useState } from "react";
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
  ArrowBendDoubleUpLeft,
  ArrowBendUpLeft,
  ArrowBendUpRight,
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

const Inbox: React.FC = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [emailList, setEmailList] = useState<EmailObject[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const { allSetting } = useProfileStore();

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
    setUnReadFunc((d) => {
      const { email_id, unread } = d as { email_id: number; unread: boolean };
      setUnread(email_id, unread);
    });

    setNotifyFunc((d) => {
      const { mode, notify, mail } = d as {
        mode: "append" | "remove";
        notify: boolean;
        mail: EmailObject;
      };

      if (mode == "append") {
        setEmailList((l) => [mail, ...l]);
        if (notify) {
          if (document.hasFocus()) {
            toast.success(`New message from: ${mail.b_from}`, {
              description: mail.b_subject,
            });
          } else {
            let n = new Notification(`From: ${mail.b_from}`, {
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

  const setUnread = (email_id: number, unread: boolean) => {
    setEmailList((e) =>
      e.map((email) => {
        if (email.id === email_id) {
          return { ...email, unread };
        }
        return email;
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

    const email = emailList[index];
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <MailRow
          onClick={() => {
            setEmailOpen(true);
            setOpenEmail(email);
            setUnread(email.id, false);
          }}
          {...email}
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

  const fetchEmails = async () => {
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setIsLoading(true);
    try {
      const res = await api.post<{ hasMore: boolean; emails: EmailObject[] }>(
        "/listing",
        { page }
      );
      setEmailList((prevEmails) => [...prevEmails, ...res.data.emails]);
      setHasMore(res.data.hasMore);
      setPage((prevPage) => prevPage + 1);
      setLoadInbox();
    } catch (error) {
      console.error("Error fetching emails:", error);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
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
  const [openEmail, setOpenEmail] = useState<EmailObject | undefined>();

  const handleClose = () => {
    setEmailOpen(!emailOpen);
  };

  return (
    <motion.div className="w-full flex flex-col flex-1 overflow-hidden">
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
                overflow: "auto",
              }}
            >
              <div
                className="scroll-bar"
                style={{
                  height: `${rowVirtualizer.totalSize}px`,
                  width: "100%",
                  position: "relative",
                }}
              >
                {rowVirtualizer.virtualItems.map((virtualRow) => (
                  <div
                    key={virtualRow.index}
                    ref={virtualRow.measureRef}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
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

        <AnimatePresence>
          {emailOpen && (
           <ResizablePanel minSize={30} maxSize={65} defaultSize={60}>
           <motion.div
             initial={{ x: 100, opacity: 0 }}
             animate={{ x: 0, opacity: 1 }}
             exit={{ x: 100, opacity: 0 }}
             transition={{
               type: "spring",
               stiffness: 300,
               damping: 30,
               duration: 0.5
             }}
           >
             <MailViewer
               key={openEmail?.id || 0}
               email={openEmail as EmailObject}
               onClose={handleClose}
             />
           </motion.div>
         </ResizablePanel>
          )}
        </AnimatePresence>
      </ResizablePanelGroup>
    </motion.div>
  );
};

const MailViewer: React.FC<{
  email: EmailObject;
  key: number;
  onClose: () => void;
}> = ({ email, key, onClose }) => {
  const [viewMode] = useState(
    email.b_html && email.b_html !== "" ? "html" : "text"
  );
  const htmlView = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (htmlView.current) {
      let d =
        htmlView.current.contentWindow?.document ||
        htmlView.current.contentDocument;

      d?.open();
      d?.write(email.b_html);
      d?.close();
    }
  }, [viewMode, key]);

  useEffect(() => {
    sendToWs(
      JSON.stringify({
        event: "unread",
        data: {
          email_id: email.id,
          unread: false,
        },
      })
    );
  }, []);

  return (
    <motion.div className="p-2">
      <div className="flex w-full justify-between px-1">
        <div className="w-full px-1">
          <Tooltip tip={email.b_subject}>
            <h1 className="text-xl font-medium text-start line-clamp-2">
              {email.b_subject}
            </h1>
          </Tooltip>
        </div>
        <div>
          <Button variant={"toolbutton"} onClick={onClose}>
            <X size={18} />
          </Button>
        </div>
      </div>

      <div className="flex justify-between">
        <div className="my-2 mx-2 flex gap-3">
          <Avatar className="w-12 h-12">
            <AvatarImage src={email.from_profile} />
            <AvatarFallback>R</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-medium ">{email.b_from_name || "unknown"}</h2>
            <div className="flex items-center gap-2 text-[rgba(0,0,0,0.5)] dark:text-[rgba(255,255,255,0.5)]">
              <p className="text-sm">To:</p>
              {email.b_to.map((recipient, index) => (
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
                    <div className="flex gap-3 flex-col">
                      <p className="text-sm">{recipient}</p>
                      <Button variant={"primary"} className="gap-2 w-full !rounded-full">
                        <ArrowBendUpLeft size={18} />
                        <p>Reply</p>
                      </Button>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}
            </div>
          </div>
        </div>
        <div>
          <p className="text-[rgba(0,0,0,0.5)] mt-3 dark:text-[rgba(255,255,255,0.5)] text-sm">
            {email.b_datetime}
          </p>
        </div>
      </div>

      <div className="m-1 mt-5 rounded-md shadow">
        {viewMode === "text" ? (
          <pre className="text-sm">{email.b_text}</pre>
        ) : (
          <iframe
            className="bg-white w-full rounded-md h-[500px]"
            ref={htmlView}
          />
        )}
      </div>
      <div className="mx-1 mt-4 flex gap-2">
        <Button variant={"primary"}  className="gap-2 !rounded-full">
          <ArrowBendUpLeft size={18} />
          <p>Reply</p>
        </Button>
        <Button variant={"secondary"} className="!rounded-full">
          <ArrowBendDoubleUpLeft size={18} />
          <p>Reply All</p>
        </Button>
        <Button variant={"secondary"} className="!rounded-full">
          <ArrowBendUpRight size={18} />
          <p>Forward</p>
        </Button>
      </div>
    </motion.div>
  );
};

export default Inbox;
