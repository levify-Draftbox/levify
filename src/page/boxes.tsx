import ToolBar from "@/components/ToolBar";
import { useVirtual } from "react-virtual";
import React, { useEffect, useRef, useState } from "react";
import MailRow from "@/components/MailRow";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/Spinner";
import useloadInboxModal from "@/store/loadinbox";
import { motion, AnimatePresence } from "framer-motion";
import {
  AddressBookTabs,
  ArrowBendDoubleUpLeft,
  ArrowBendUpLeft,
  ArrowBendUpRight,
  EnvelopeSimple,
  Trash,
  FolderPlus,
  X,
  Tag,
  Funnel,
  DotsThree,
  Archive,
  CaretDown,
  CaretUp,
  Tray,
  Star,
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
import useListState from "@/store/listState";

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
  thread_id: string;
  unread: boolean;
  subject: string;
  latest_date: string;
  emails: Email[];
};

const Boxes: React.FC<{ path: string }> = ({ path }) => {
  const { openEmail, setOpenEmail } = useListState();

  path = path || "inbox";

  const handleClose = () => {
    setOpenEmail(undefined);
  };

  const [htmlViewWidth, setHtmlViewWidth] = useState(65);

  return (
    <motion.div className="w-full flex flex-col flex-1 overflow-hidden h-full">
      <ToolBar path={path} className={""} key={path} />

      <ResizablePanelGroup
        direction="horizontal"
        className="max-w-full !flex-1 !h-full"
      >
        <AnimatePresence>
          <ResizablePanel className="!overflow-hidden h-full">
            <ListViewer key={path} path={path} />
          </ResizablePanel>
        </AnimatePresence>

        <ResizableHandle className="bg-transparent" />

        {openEmail && (
          <ResizablePanel
            minSize={50}
            maxSize={70}
            defaultSize={htmlViewWidth}
            onResize={(e) => setHtmlViewWidth(e)}
          >
            <div className="!h-full border-l border-border">
              <MailViewer
                key={openEmail?.thread_id || ""}
                emails={openEmail as EmailObj}
                onClose={handleClose}
                width={htmlViewWidth}
              />
            </div>
          </ResizablePanel>
        )}
      </ResizablePanelGroup>
    </motion.div>
  );
};

const ListViewer: React.FC<{
  path: string;
}> = ({ path }) => {
  const { list: emailListObjs, loadMore } = useList();
  const {
    listPos: listPosObj,
    hasMore: hasMoreObj,
    setListPos,
    openEmail,
    setOpenEmail,
  } = useListState();

  path = path || "inbox";

  const emailList = emailListObjs[path] || [];
  const listPos = listPosObj[path] || 0;
  const hasMore = hasMoreObj[path] == undefined ? true : hasMoreObj[path];

  const [isLoading, setIsLoading] = useState(false);
  const { setLoad: setLoadInbox } = useloadInboxModal();

  const isFetchingRef = useRef(false);
  const parentRef = useRef<HTMLDivElement>(null);

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
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <MailRow
          onClick={() => {
            setOpenEmail(e);
          }}
          datetime={e.latest_date}
          text={e.emails[0].b_text}
          subject={e.subject}
          count={e.emails.length}
          fromNames={e.emails.map((e: Email) => ({
            email: e.b_from,
            name: e.b_from_name,
            profile: e.from_profile,
          }))}
          unread={
            e.emails.find((e: Email) => e.path == path && e.unread)
              ?.unread as boolean
          }
          className={cn(
            "hover:bg-[rgba(0,0,0,0.02)] dark:hover:bg-[rgba(255,255,255,0.025)]",
            {
              "!bg-[rgba(0,0,0,0.04)] dark:!bg-[rgba(255,255,255,0.04)] dark:!border-[rgba(255,255,255,0.04)]":
                isSelected,
            }
          )}
        />
      </motion.div>
    );
  };

  const fetchEmails = async () => {
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;
    setIsLoading(true);

    loadMore(path, (err) => {
      setIsLoading(false);
      setLoadInbox();
      if (!err) {
        isFetchingRef.current = false;
      }
    });
  };

  const rowVirtualizer = useVirtual({
    size: hasMore ? emailList.length + 1 : emailList.length,
    parentRef,
    estimateSize: React.useCallback(() => 100, []),
  });

  useEffect(() => {
    if (listPos == 0) {
      /* empty */
    } else {
      rowVirtualizer.scrollToIndex(listPos);
    }
  }, []);

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

  return (
    <>
      <motion.div className="bg-inbox-bg !overflow-hidden h-full">
        <div
          className="h-full w-full overflow-auto scroll-bar"
          ref={parentRef}
          key={path}
          onScroll={() => {
            const firstItem = rowVirtualizer.virtualItems[0];
            setListPos(path, firstItem.index);
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
    </>
  );
};

const MailViewer: React.FC<{
  emails: EmailObj;
  key: number | string;
  onClose: () => void;
  width: number;
}> = ({ emails, onClose, width: htmlWidth }) => {
  const { setUnread } = useList();

  let e = emails.emails[0];
  let revArray = emails.emails.slice().reverse();
  let lastEmail = revArray.find((e) => e.new == false || !e.new) || revArray[0];

  useEffect(() => {
    if (lastEmail.unread) {
      setUnread({
        notify: true,
        thread_id: lastEmail.thread_id,
        email_id: lastEmail.id,
        unread: false,
        path: emails.emails.slice(-1)[0].path,
      });
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0.5 }}
      className="px-6 pb-6 h-full overflow-auto scroll-bar dark:bg-background"
    >
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
                  <span className="inline">{subjectInfo.cleanSubject}</span>
                </span>
              );
            })()}
          </h1>
        </div>
        <div>
          <Button variant={"ghost"} className="p-2" onClick={onClose}>
            <X size={18} />
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {emails.emails.map((e, i) => {
          if (true)
            return (
              <EmailBlock
                totalEmail={emails.emails.length}
                last={i == emails.emails.length - 1}
                openBlock={e.uid == lastEmail.uid}
                panelWidth={htmlWidth}
                {...e}
              />
            );
        })}
      </div>
    </motion.div>
  );
};

const EmailBlock = (
  e: Email & {
    panelWidth: number;
    openBlock: boolean;
    last: boolean;
    totalEmail: number;
  }
) => {
  const viewMode = e.b_html && e.b_html !== "" ? "html" : "text";
  const htmlView = useRef<HTMLIFrameElement>(null);
  const [emailHeight, setEmailHeight] = useState<number>(10);
  const [openBlock, setOpenBlock] = useState(
    e.totalEmail == 1 ? true : e.new ? false : e.openBlock
  );

  const [showFullTimestamp, setShowFullTimestamp] = useState(false);

  const formatShortTimestamp = (timestamp: string) => {
    const now = moment();
    const emailTime = moment(timestamp);

    if (now.diff(emailTime, "hours") < 24) {
      return emailTime.format("h:mm A");
    } else {
      return emailTime.format("MMM D");
    }
  };

  const formatFullTimestamp = (timestamp: string) => {
    return moment(timestamp).format("MMM D, YYYY h:mm A");
  };

  const { setUnread } = useList();

  const injectCSS = () => {
    if (htmlView.current) {
      const d =
        htmlView.current.contentWindow?.document ||
        htmlView.current.contentDocument;

      if (d) {
        const styleElement = d.createElement("style");
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
        const bodyMargin =
          parseFloat(getComputedStyle(d.body).marginTop) +
          parseFloat(getComputedStyle(d.body).marginBottom);
        setEmailHeight(newHeight > 0 ? newHeight + bodyMargin : 300); // Fallback to 300px if height is 0
      }
    }
  };

  useEffect(() => {
    const observeImages = (document: Document) => {
      const images = document.querySelectorAll("img");
      images.forEach((img) => {
        img.addEventListener("load", updateHeight);
        img.addEventListener("error", updateHeight); // Handle errors
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
    window.addEventListener("resize", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);

      // Cleanup image load listeners
      if (htmlView.current) {
        const d =
          htmlView.current.contentWindow?.document ||
          htmlView.current.contentDocument;
        if (d) {
          const images = d.querySelectorAll("img");
          images.forEach((img) => {
            img.removeEventListener("load", updateHeight);
            img.removeEventListener("error", updateHeight);
          });
        }
      }
    };
  }, [viewMode, e.panelWidth, openBlock]);

  useEffect(() => injectCSS(), []);

  if (!openBlock) {
    return (
      <div
        className={cn(
          "p-4 border border-border rounded-md bg-background-secondary cursor-pointer",
          {
            "border-core": e.unread,
          }
        )}
      >
        <div className="flex justify-between">
          <div
            className="my-0 flex gap-3 w-[90%]"
            onClick={() => {
              setOpenBlock(true);
              if (e.unread) {
                setUnread({
                  notify: true,
                  email_id: e.id,
                  thread_id: e.thread_id,
                  unread: false,
                  path: e.path,
                });
              }
            }}
          >
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
              <div className="flex items-center gap-2  text-[rgba(0,0,0,0.5)] dark:text-[rgba(255,255,255,0.5)]">
                <p className="text-sm text-start line-clamp-1">
                  {htmlToText(viewMode == "html" ? e.b_html : e.b_text)}
                </p>
              </div>
            </div>
          </div>
          <div className="w-[150px]">
            <div className="w-full flex flex-col items-end">
              <div className="flex gap-1 text-[rgba(0,0,0,0.5)] dark:text-[rgba(255,255,255,0.5)]">
                <Tooltip tip="Star message">
                  <Star size={16} />
                </Tooltip>

                <Tooltip tip="Inbox">
                  <Tray size={16} />
                </Tooltip>
                <p className="text-[rgba(0,0,0,0.5)] dark:text-[rgba(255,255,255,0.5)] text-sm">
                  {formatShortTimestamp(e.b_datetime)}
                </p>
              </div>
              <Button
                variant={"ghost"}
                size={"mail"}
                className="!px-2 !py-1 mt-1"
              >
                <CaretDown size={15} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "p-4 border border-border rounded-md bg-background-secondary"
      )}
    >
      <div className="flex justify-between items-end">
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

        <div className="w-[130px]">
          <div className="w-full flex flex-col items-end">
            <div className="flex justify-end w-full gap-1 text-[rgba(0,0,0,0.5)] dark:text-[rgba(255,255,255,0.5)]">
              <Tooltip tip="Star message">
                <Star size={16} />
              </Tooltip>

              <Tooltip tip="Inbox">
                <Tray size={16} />
              </Tooltip>
              <p className="text-[rgba(0,0,0,0.5)] flex dark:text-[rgba(255,255,255,0.5)] text-sm">
                {formatShortTimestamp(e.b_datetime)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="mail"
              className="!px-2 !py-1 mt-1"
              onClick={() => {
                setShowFullTimestamp(!showFullTimestamp);
              }}
            >
              {showFullTimestamp ? (
                <CaretUp size={15} />
              ) : (
                <CaretDown size={15} />
              )}
            </Button>
          </div>
        </div>
      </div>
      <div className="mt-3">
        {showFullTimestamp && (
          <AnimatePresence>
            <motion.div
              className="text-[rgba(0,0,0,0.5)] dark:text-[rgba(255,255,255,0.5)] text-sm mt-1"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {formatFullTimestamp(e.b_datetime)}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <div className="flex justify-between py-1">
        <div className="mt-4 flex  border-[1px] rounded-md">
          <Tooltip tip="Archive">
            <Button
              variant={"mail"}
              size={"mail"}
              className="border-0 rounded-none rounded-l-md"
            >
              <Archive size={15} />
            </Button>
          </Tooltip>
          <Tooltip tip="Move to trash">
            <Button
              variant={"mail"}
              size={"mail"}
              className="!rounded-none border-0"
            >
              <Trash size={15} />
            </Button>
          </Tooltip>
          <Tooltip tip="Move to">
            <Button
              variant={"mail"}
              size={"mail"}
              className="!rounded-none  border-0"
            >
              <FolderPlus size={15} />
            </Button>
          </Tooltip>
          <Tooltip tip="Add tag">
            <Button
              variant={"mail"}
              size={"mail"}
              className="!rounded-none border-0"
            >
              <Tag size={15} />
            </Button>
          </Tooltip>
          <Tooltip tip="Filter">
            <Button
              variant={"mail"}
              size={"mail"}
              className="!rounded-none border-0"
            >
              <Funnel size={15} />
            </Button>
          </Tooltip>
          <Tooltip tip="More">
            <Button
              variant={"mail"}
              size={"mail"}
              className="!rounded-none border-0 !rounded-r-md"
            >
              <DotsThree size={15} />
            </Button>
          </Tooltip>
        </div>
        <div className="mt-4 flex rounded-md border-[1px]">
          <Tooltip tip="Reply">
            <Button
              variant={"mail"}
              size={"mail"}
              className="border-0 rounded-none rounded-l-md"
            >
              <ArrowBendUpLeft size={15} />
            </Button>
          </Tooltip>
          <Tooltip tip="Reply all">
            <Button
              variant={"mail"}
              size={"mail"}
              className="!rounded-none border-0"
            >
              <ArrowBendDoubleUpLeft size={15} />
            </Button>
          </Tooltip>
          <Tooltip tip="forward">
            <Button
              variant={"mail"}
              size={"mail"}
              className="!rounded-none border-0 !rounded-r-md"
            >
              <ArrowBendUpRight size={15} />
            </Button>
          </Tooltip>
        </div>
      </div>

      <div className="mt-2 shadow">
        {viewMode === "text" ? (
          <pre
            className="font-sans bg-white text-black rounded-md p-4"
            style={{
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
          >
            {e.b_text}
          </pre>
        ) : (
          <iframe
            style={{
              height: emailHeight,
            }}
            className="bg-white w-full h-[500px] rounded-md overflow-hidden"
            ref={htmlView}
          />
        )}
      </div>
    </div>
  );
};

function htmlToText(htmlString: string): string {
  const strippedHtml = htmlString.replace(
    /<style[^>]*>[\s\S]*?<\/style>/gi,
    ""
  );
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = strippedHtml;
  const text = tempDiv.innerText || tempDiv.textContent || "";
  return text.split(" ").slice(0, 100).join(" ");
}

export function processEmailSubject(subject: string): {
  tags: string[] | undefined;
  cleanSubject: string;
} {
  const tagRegex = /^\s*(\[[^\]]+\]\s*)+/g;
  const matches = subject.match(tagRegex);
  let tags: string[] | undefined = [];
  if (matches) {
    tags = matches[0]
      .match(/\[([^\]]+)\]/g)
      ?.map((tag) => tag.replace(/[[\]]/g, ""));
  }
  const cleanSubject = subject.replace(tagRegex, "").trim();
  return {
    tags,
    cleanSubject,
  };
}

export default Boxes;
