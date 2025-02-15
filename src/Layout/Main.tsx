import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import SideBar from "../components/SideBar";
import { Outlet } from "react-router-dom";
import { useEffect, useRef } from "react";
import Composer from "@/composer";
import useComposerStore from "@/store/composer";
import { useProfileStore } from "@/store/profile";
// import SearchBar from "@/components/SearchBar";
import { connectWS, setNotifyFunc, setUnReadFunc } from "@/lib/ws";
import { Spinner } from "@/components/Spinner";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion"
import useloadInboxModal from "@/store/loadinbox";
import { toast } from "sonner";
import useList from "@/store/list";
import { Email } from "@/page/boxes";

const Main = () => {
  const mainLayout = useRef<HTMLDivElement>(null);
  const { setParantSize, setAllowComposer } = useComposerStore();
  const { fetchAllProfiles, load: loadSettings } = useProfileStore();
  const { load: inboxLoad } = useloadInboxModal()
  let theme = "dark";

  useEffect(() => {
    // if (Notification.permission !== 'granted') Notification.requestPermission()

    setAllowComposer()
    fetchAllProfiles()
    connectWS()

    window.addEventListener("resize", setLayoutSize);
    window.addEventListener("load", setLayoutSize);
    return () => {
      window.removeEventListener("resize", setLayoutSize);
      window.removeEventListener("load", setLayoutSize);
    };
  }, []);
  const setLayoutSize = () =>
    setParantSize(mainLayout.current?.clientWidth || 800);


  const { allSetting } = useProfileStore()
  const { setUnread, appendMail } = useList()

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
      const { id, unread, thread_id, path } = d as Email;

      setUnread({
        notify: false,
        unread: unread || false,
        email: {
          path: path,
          id: id,
          thread_id: thread_id,
          unread: !unread,
        } as Email
      })
    });

    setNotifyFunc((d) => {
      const { mode, notify, email_t: emails, paths, thread_id: threadId } = d as {
        mode: "append" | "remove";
        notify: boolean;
        email_t: Email[];
        paths: string[];
        thread_id: string;
      };

      if (mode == "append") {
        appendMail(paths, emails, threadId)

        let [email] = emails.slice(-1)

        if (notify) {
          if (document.hasFocus()) {
            toast.success(`New message from: ${email.b_from}`, {
              description: email.b_subject,
            });
          } else {
            const n = new Notification(`From: ${email.b_from}`, {
              body: email.b_subject,
              icon: "/favicon.png",
            });
            n.onclick = () => {
              console.log("Click");
            };
          }
          playSound();
        }
      }

    });
  }, [])

  return (
    <>
      {!(loadSettings && inboxLoad) &&
        <div className="w-full h-screen justify-center items-center flex">
          <div className="flex-col items-center">
            <div className="w-64 flex-col items-center">
              <img
                className="w-full"
                alt="DraftBox Mail"
                src={
                  theme === "system"
                    ? !window.matchMedia("(prefers-color-scheme: dark)").matches
                      ? "/logo-light.svg"
                      : "/logo-dark.svg"
                    : theme === "light"
                      ? "/logo-light.svg"
                      : "/logo-dark.svg"
                }
              />
              <div className="mt-3 w-full flex justify-center">
                <Spinner size={30} />
              </div>
            </div>
          </div>
        </div>
      }
      {loadSettings &&
        <div className="!h-screen overflow-hidden">
          <motion.div className={cn(
            "h-full",
            { "p-1": true }
          )}
            initial={{
              opacity: .0,
              scale: .95
            }}
            animate={inboxLoad ? {
              opacity: 1,
              scale: 1
            } : {}}
            transition={{
              ease: "easeIn",
              duration: .25
            }}
          >
            <ResizablePanelGroup
              direction="horizontal"
              className={cn(
                "w-full h-full overflow-hidden",
                {
                  "border border-border rounded-md": true
                }
              )}
            >
              <ResizablePanel minSize={13} maxSize={20} defaultSize={13}>
                <div className="h-full">
                  <SideBar />
                </div>
              </ResizablePanel>

              <ResizableHandle className="bg-transparent" />

              <ResizablePanel defaultSize={87} onResize={setLayoutSize}>
                <div
                  className="w-full h-full bg-background flex flex-col relative p-[6px]"
                  ref={mainLayout}
                >
                  {/* <SearchBar /> */}

                  <div className="border border-border rounded-md overflow-hidden flex-1 overflow bg-background-secondary">
                    <Outlet />
                  </div>

                  <Composer />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </motion.div>
        </div>
      }
    </>
  )
};

export default Main;
