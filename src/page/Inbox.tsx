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
import { toast } from "sonner";
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
import { cn } from "@/lib/utils";

import useList from "@/store/list";
import useListPos from "@/store/listPos";

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
  new: boolean;
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

  const { list: emailListObjs, setList } = useList()
  const { listPos: listPosObj, setListPos } = useListPos()

  let path = "inbox"
  const emailList = emailListObjs[path] || []
  const listPos = listPosObj[path]

  // const [emailList, setEmailList] = useState<EmailObj[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { setLoad: setLoadInbox } = useloadInboxModal();

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
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <MailRow
          onClick={() => {
            setEmailOpen(true);
            console.log(e);
            setOpenEmail(e);
          }}

          datetime={e.latest_date}
          text={e.emails[0].b_text}
          subject={e.subject}
          count={e.emails.length}
          fromNames={e.emails.map(e => ({
            email: e.b_from,
            name: e.b_from_name,
            profile: e.from_profile,
          }))}

          unread={e.emails.find(e => e.unread)?.unread as boolean}

          className={cn(
            "hover:bg-[rgba(0,0,0,0.02)] dark:hover:bg-[rgba(255,255,255,0.025)]",
            {
              "!bg-[rgba(0,0,0,0.04)] dark:!bg-[rgba(255,255,255,0.04)] dark:!border-[rgba(255,255,255,0.04)]": isSelected
            }
          )}
        />
      </motion.div>
    );
  };

  const rowVirtualizer = useVirtual({
    size: hasMore ? emailList.length + 1 : emailList.length,
    parentRef,
    estimateSize: React.useCallback(() => 100, []),
  })

  useEffect(() => rowVirtualizer.scrollToIndex(listPos), [])

  // TODO: implement react query!
  const isFetchingRef = useRef(false);

  const fetchEmails = async (isRefresh = false) => {
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setIsLoading(true);
    try {
      const res = await api.post<{ hasMore: boolean; emails: EmailObj[] }>(
        "/listing",
        { offset: emailList.length }
      );
      setList(path, res.data.emails)
      setHasMore(res.data.hasMore)
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
    <motion.div className="w-full flex flex-col flex-1 overflow-hidden h-full">
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
                onScroll={() => {
                  const firstItem = rowVirtualizer.virtualItems[0]
                  console.log(firstItem);
                  setListPos(path, firstItem.index)
                }}
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

        <ResizableHandle className="bg-transparent" />

        {emailOpen && (
          <ResizablePanel minSize={30} maxSize={65} defaultSize={htmlViewWidth} onResize={(e) => setHtmlViewWidth(e)}>
            <div className="!h-full border-l border-border">
              <MailViewer
                key={openEmail?.thread_id || ""}
                emails={openEmail as EmailObj}
                onClose={handleClose}
                width={htmlViewWidth}
                path={path}
              />
            </div>
          </ResizablePanel>
        )}
      </ResizablePanelGroup>
    </motion.div>
  );
};

const MailViewer: React.FC<{
  emails: EmailObj;
  key: number | string;
  onClose: () => void;
  width: number;
  path: string
}> = ({ emails, onClose, width: htmlWidth, path }) => {

  const { setUnread } = useList()

  let e = emails.emails[0]
  let revArray = emails.emails.slice().reverse()
  let lastEmail = revArray.find((e) => e.new == false || !e.new) || revArray[0]

  useEffect(() => {
    if (lastEmail.unread) {
      setUnread({
        notify: true,
        thread_id: lastEmail.thread_id,
        email_id: lastEmail.id,
        unread: false,
        path: path,
      })
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: .5 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: .5 }}
      className="px-6 pb-6 h-full overflow-auto scroll-bar dark:bg-background">
      <div className="flex w-full justify-between my-4 items-center">
        <div className="flex-1">

          <h1
            className="text-xl font-medium text-start line-clamp-2"
            title={e.b_subject}
          >
            {(() => {
              const subjectInfo = processEmailSubject(e.b_subject);
              return (
                <span>
                  {/* Tags */}
                  {subjectInfo.tags?.map((s, k) => (
                    <span
                      key={k}
                      className="bg-button-hover rounded-md px-2 whitespace-nowrap inline-block mr-2"
                    >
                      {s}
                    </span>
                  ))}
                  {/* Subject */}
                  <span className="inline">
                    {subjectInfo.cleanSubject}
                  </span>
                </span>
              );
            })()}
          </h1>
        </div>
        <div>
          <Button variant={"toolbutton"} onClick={onClose}>
            <X size={18} />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {emails.emails.map((e, i) => {
          if (true)
            return <EmailBlock
              totalEmail={emails.emails.length}
              last={i == emails.emails.length - 1}
              openBlock={e.uid == lastEmail.uid}
              panelWidth={htmlWidth}
              {...e}
              path={path}
            />
        })}
      </div>

      <div className="mt-4 flex gap-2">
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

    </motion.div>
  );
};

const EmailBlock = (e: Email & { panelWidth: number, openBlock: boolean, path: string, last: boolean, totalEmail: number }) => {
  const viewMode = e.b_html && e.b_html !== "" ? "html" : "text"
  const htmlView = useRef<HTMLIFrameElement>(null);
  const [emailHeight, setEmailHeight] = useState<number>(10)
  const [openBlock, setOpenBlock] = useState(e.totalEmail == 1 ? true : (e.new ? false : e.openBlock))

  const { setUnread } = useList()

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
        const bodyMargin = parseFloat(getComputedStyle(d.body).marginTop) + parseFloat(getComputedStyle(d.body).marginBottom);
        setEmailHeight(newHeight > 0 ? newHeight + bodyMargin : 300); // Fallback to 300px if height is 0
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
          d.write(e.b_html);
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
  }, [viewMode, e.panelWidth, openBlock]);

  useEffect(() => injectCSS(), [])

  if (!openBlock) {
    return (
      <div className={cn(
        "p-4 border border-border rounded-md bg-background-secondary cursor-pointer",
        {
          "border-core": e.unread
        }
      )} onClick={() => {
        setOpenBlock(true)
        if (e.unread) {
          setUnread({
            notify: true,
            email_id: e.id,
            thread_id: e.thread_id,
            unread: false,
            path: e.path,
          })
        }
      }} >
        <div className="flex justify-between">
          <div className="my-0 flex gap-3">
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
                <p className="text-sm text-start line-clamp-2">
                  {htmlToText(viewMode == "html" ? e.b_html : e.b_text)}
                </p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-[rgba(0,0,0,0.5)] mt-3 dark:text-[rgba(255,255,255,0.5)] text-sm">
              {moment(e.b_datetime).format("lll")}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "p-4 border border-border rounded-md bg-background-secondary"
      )}
    >
      <div className="flex justify-between bs">
        <div className="my-0 flex gap-3">
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
          />
        )}
      </div>
    </div>
  )
}

function htmlToText(htmlString: string): string {
  const strippedHtml = htmlString.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = strippedHtml;
  const text = tempDiv.innerText || tempDiv.textContent || '';
  return text.split(" ").slice(0, 100).join(" ")
}

export function processEmailSubject(subject: string): {
  tags: string[] | undefined
  cleanSubject: string
} {
  const tagRegex = /^\s*(\[[^\]]+\]\s*)+/g;
  const matches = subject.match(tagRegex);
  let tags: string[] | undefined = [];
  if (matches) {
    tags = matches[0].match(/\[([^\]]+)\]/g)?.map(tag => tag.replace(/[\[\]]/g, ''));
  }
  const cleanSubject = subject.replace(tagRegex, '').trim();
  return {
    tags,
    cleanSubject
  };
}

export default Inbox;
