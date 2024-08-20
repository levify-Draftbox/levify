import ToolBar from "@/components/ToolBar";
import api from "@/lib/api";
import { useVirtual } from 'react-virtual';
import React, { useEffect, useRef, useState } from "react";
import Mail from "@/components/Mail";

// TODO: move to type file
export type EmailObject = {
  id: number;
  uid: string;
  dateandtime: string;
  from: string;
  to: string[];
  b_datetime: string;
  b_from: string;
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

  const renderEmail = (index: number) => {
    if (index >= emailList.length) {
      return (
        <div style={{ padding: '10px', textAlign: 'center' }}>
          Loading...
        </div>
      );
    }

    const email = emailList[index]; 
    return <Mail b_subject={email.b_subject} b_from={email.b_from} from_profile={email.from_profile} />
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

  return (
    <div className="w-full flex flex-col flex-1 overflow-hidden">
      <ToolBar className={""} />
      <div className="bg-inbox-bg overflow-hidden flex-1">
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
    </div>
  );
};

export default Inbox;
