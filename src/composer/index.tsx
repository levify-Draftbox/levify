import useComposerStore from "@/store/composer";
import EmailSelector, { EmailOption, emailRegex } from "./email-input";
import { lazy, Suspense, useEffect, useState } from "react";
import {
  SelectGroup,
  SelectItem,
  SelectRoot,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Button } from "../components/ui/button";
import {
  ArrowsInSimple,
  ArrowsOutSimple,
  ClockCountdown,
  Minus,
  PaperPlaneTilt,
  X,
} from "@phosphor-icons/react";
import ScrollArea from "../components/ui/ScrollArea";
import {
  motion,
  AnimatePresence,
  VariantLabels,
  AnimationControls,
  TargetAndTransition,
} from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

import { Tooltip } from "../components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useProfileStore } from "@/store/profile";
import { htmlToText } from "html-to-text";
import { toast } from "sonner";
import api from "@/lib/api";
import { Spinner } from "@/components/Spinner";

const BlockEditor = lazy(() => import("./editor"))

type StyleProps =
  | boolean
  | VariantLabels
  | AnimationControls
  | TargetAndTransition;

const Composer: React.FC<{}> = () => {
  const { composers } = useComposerStore();

  return (
    <div className="absolute h-full w-full pointer-events-none">
      {Object.keys(composers).map((cid, i) => {
        if (composers[cid]) {
          return <ComposerModal key={i} composerId={cid} />;
        }
      })}
    </div>
  );
};

const emails: EmailOption[] = [
  { email: "hello@parthka.dev" },
  { email: "hello@raviitaliya.info" },
  { email: "parthka.2005@gmail.com" },
  { email: "parthka.2005@proton.me" },
  { email: "pthreeh@outlook.com" },
  { email: "raviitaliya@proton.me" },
  { email: "raviitaliyaa@outlook.com" },
];
function searchEmails(query: string): EmailOption[] {
  if (query.trim() === "") {
    return emails.slice(0, 5);
  }

  const lowercaseQuery = query.toLowerCase();
  const filteredEmails = emails.filter(
    (email) =>
      email.email.toLowerCase().includes(lowercaseQuery) ||
      (email.name && email.name.toLowerCase().includes(lowercaseQuery))
  );

  return filteredEmails.slice(0, 5);
}

const ComposerModal: React.FC<{
  composerId: string;
}> = ({ composerId }) => {
  const { emails: userEmails } = useProfileStore();

  const {
    removeComposer,
    composers: allComposer,
    setComposer,
    activeid: composerActive,
    setActive,
    incIndex,
    parentSize,
  } = useComposerStore();
  const composer = allComposer[composerId];

  const location = useLocation();
  const router = useNavigate();

  useEffect(() => {
    if (!location.pathname.includes("composer"))
      setComposer(composerId, { fullScreen: false });
    else if (composerActive == composerId)
      setComposer(composerId, { fullScreen: true });
  }, [location]);

  const [open, setOpen] = useState(true);

  const { allSetting } = useProfileStore();

  const [searchItem, setSearchItem] = useState("");
  const [searchedEmail, setSearchedEmail] = useState<EmailOption[]>([]);

  useEffect(() => {
    setSearchedEmail(searchEmails(searchItem));
  }, [searchItem]);

  const commonStyle: StyleProps = {
    ...(composerActive == composerId
      ? { filter: "brightness(100%)" }
      : { filter: "brightness(90%)" }),
  };

  const [isDragging, setIsDragging] = useState(false);
  const [rightPos, setRightPos] = useState(0);

  const [maxRight, setMaxRight] = useState(parentSize - 600 - 12 * 2);
  useEffect(() => setMaxRight(parentSize - 600 - 12 * 2), [parentSize]);
  useEffect(
    () => setRightPos(rightPos >= maxRight ? maxRight : rightPos),
    [maxRight]
  );

  const handleMouseMove = (e: any) => {
    if (!isDragging) return;
    setRightPos((prevRightPos) => {
      return prevRightPos - e.movementX <= 0
        ? 0
        : prevRightPos - e.movementX >= maxRight
          ? maxRight
          : prevRightPos - e.movementX;
    });
    setComposer(composerId, {
      x:
        rightPos - e.movementX <= 0
          ? 0
          : rightPos - e.movementX >= maxRight
            ? maxRight
            : rightPos - e.movementX,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  const boxStyle: StyleProps = {
    opacity: 1,
    width: 600,
    margin: "0 12px",
    bottom: composer?.fullScreen ? 0 : composer?.minimize ? -600 + 60 : 0,

    ...commonStyle,
  };

  const fullScreenStyle: StyleProps = {
    width: "100%",
    height: "100%",
    margin: "0",
    opacity: 1,
    border: "none",
    right: 0,
    bottom: composer?.fullScreen ? 0 : composer?.minimize ? -600 + 48 : 0,

    ...commonStyle,
  };

  const [from, setFrom] = useState(userEmails[0]);
  const [to, setTo] = useState<{ email: string }[]>([]);
  const [subject, setSubject] = useState("");
  const [loading, setIsLoading] = useState(false);
  const [html, setHtml] = useState("")

  const sendMail = () => {
    setIsLoading(true);

    let onlyToArr = to.map((t) => t.email);

    if (to.length == 0) {
      toast.info(`Enter To first!`);
      setIsLoading(false);
      return;
    }

    if (subject.trim() == "") {
      toast.info(`Enter Subject fist!`);
      setIsLoading(false);
      return;
    }

    let formPyload = new FormData();
    formPyload.append("from", from);

    let errOnEmail = false;
    onlyToArr.map((e) => {
      if (!emailRegex.test(e)) {
        errOnEmail = true;
        toast.error(`Invalid Email in To ${e}`);
      } else {
        formPyload.append("to", e);
      }
    });
    if (errOnEmail) {
      setIsLoading(false);
      return;
    }

    const text = htmlToText(html, {
      wordwrap: 130,
    });

    let newhtml = `<style>.bn-block-outer{line-height:1.5;transition:margin .2s}.bn-block{display:flex;flex-direction:column}.bn-block-content{display:flex;padding:3px 0;transition:font-size .2s;width:100%}.bn-block-content:before{transition:all .2s}.bn-block-content.ProseMirror-selectednode>*,.ProseMirror-selectednode>.bn-block-content>*{border-radius:4px;outline:4px solid rgb(100,160,255)}.bn-block-group .bn-block-group{margin-left:1.5em}.bn-block-group .bn-block-group>.bn-block-outer{position:relative}.bn-block-group .bn-block-group>.bn-block-outer:not([data-prev-depth-changed]):before{content:" ";display:inline;position:absolute;left:-20px;height:100%;transition:all .2s .1s}.bn-block-group .bn-block-group>.bn-block-outer[data-prev-depth-change="-2"]:before{height:0}.bn-inline-content code{font-family:monospace}[data-prev-depth-change="1"]{--x: 1}[data-prev-depth-change="2"]{--x: 2}[data-prev-depth-change="3"]{--x: 3}[data-prev-depth-change="4"]{--x: 4}[data-prev-depth-change="5"]{--x: 5}[data-prev-depth-change="-1"]{--x: -1}[data-prev-depth-change="-2"]{--x: -2}[data-prev-depth-change="-3"]{--x: -3}[data-prev-depth-change="-4"]{--x: -4}[data-prev-depth-change="-5"]{--x: -5}.bn-block-outer[data-prev-depth-change]{margin-left:calc(10px * var(--x))}.bn-block-outer[data-prev-depth-change] .bn-block-outer[data-prev-depth-change]{margin-left:0}[data-level="1"]{--level: 3em}[data-level="2"]{--level: 2em}[data-level="3"]{--level: 1.3em}[data-prev-level="1"]{--prev-level: 3em}[data-prev-level="2"]{--prev-level: 2em}[data-prev-level="3"]{--prev-level: 1.3em}.bn-block-outer[data-prev-type=heading]>.bn-block>.bn-block-content{font-size:var(--prev-level);font-weight:700}.bn-block-outer:not([data-prev-type])>.bn-block>.bn-block-content[data-content-type=heading]{font-size:var(--level);font-weight:700}.bn-block-content:before{margin-right:0;content:""}.bn-block-content[data-content-type=numberedListItem]{display:flex;gap:.5em}[data-content-type=numberedListItem]{--index: attr(data-index)}[data-prev-type=numberedListItem]{--prev-index: attr(data-prev-index)}.bn-block-outer[data-prev-type=numberedListItem]:not([data-prev-index=none])>.bn-block>.bn-block-content:before{content:var(--prev-index) "."}.bn-block-outer:not([data-prev-type])>.bn-block>.bn-block-content[data-content-type=numberedListItem]:before{content:var(--index) "."}.bn-block-content[data-content-type=bulletListItem]{display:flex;gap:.5em}.bn-block-content[data-content-type=checkListItem]>div{display:flex}.bn-block-content[data-content-type=checkListItem]>div>div>input{margin:0;margin-inline-end:.5em;cursor:pointer}.bn-block-content[data-content-type=checkListItem][data-checked=true] .bn-inline-content{text-decoration:line-through}.bn-block-content[data-text-alignment=center]{justify-content:center}.bn-block-content[data-text-alignment=right]{justify-content:flex-end}.bn-block-outer[data-prev-type=bulletListItem]>.bn-block>.bn-block-content:before{content:"•"}.bn-block-outer:not([data-prev-type])>.bn-block>.bn-block-content[data-content-type=bulletListItem]:before{content:"•"}[data-content-type=bulletListItem]~.bn-block-group>.bn-block-outer[data-prev-type=bulletListItem]>.bn-block>.bn-block-content:before{content:"◦"}[data-content-type=bulletListItem]~.bn-block-group>.bn-block-outer:not([data-prev-type])>.bn-block>.bn-block-content[data-content-type=bulletListItem]:before{content:"◦"}[data-content-type=bulletListItem]~.bn-block-group [data-content-type=bulletListItem]~.bn-block-group>.bn-block-outer[data-prev-type=bulletListItem]>.bn-block>.bn-block-content:before{content:"▪"}[data-content-type=bulletListItem]~.bn-block-group [data-content-type=bulletListItem]~.bn-block-group>.bn-block-outer:not([data-prev-type])>.bn-block>.bn-block-content[data-content-type=bulletListItem]:before{content:"▪"}[data-file-block] .bn-file-block-content-wrapper:has(.bn-add-file-button),[data-file-block] .bn-file-block-content-wrapper:has(.bn-file-default-preview){width:100%}[data-file-block] .bn-file-block-content-wrapper{cursor:pointer;display:flex;flex-direction:column;justify-content:stretch;-webkit-user-select:none;user-select:none}[data-file-block] .bn-add-file-button{align-items:center;background-color:#f2f1ee;border-radius:4px;color:#7d797a;display:flex;flex-direction:row;gap:10px;padding:12px;width:100%}.bn-editor[contenteditable=true] [data-file-block] .bn-add-file-button:hover{background-color:#e1e1e1}[data-file-block] .bn-add-file-button-icon{width:24px;height:24px}[data-file-block] .bn-add-file-button .bn-add-file-button-text{font-size:.9rem}[data-file-block] .bn-file-and-caption-wrapper{display:flex;flex-direction:column;border-radius:4px}[data-file-block] .bn-file-default-preview{align-items:center;border-radius:4px;display:flex;flex-direction:row;gap:4px;padding:4px;width:100%}[data-file-block] .bn-file-default-preview:hover,.ProseMirror-selectednode .bn-file-default-preview{background-color:#e1e1e1}[data-file-block] .bn-file-default-preview-icon{width:24px;height:24px}[data-file-block] .bn-visual-media-wrapper{display:flex;flex-direction:row;align-items:center;position:relative;width:fit-content}[data-file-block] .bn-visual-media{border-radius:4px;max-width:100%}[data-file-block] .bn-visual-media-resize-handle{position:absolute;width:8px;height:30px;background-color:#000;border:1px solid white;border-radius:4px;cursor:ew-resize}[data-content-type=audio]>.bn-file-block-content-wrapper,.bn-audio{width:100%}[data-file-block] .bn-file-caption{font-size:.8em;padding-block:4px}[data-file-block] .bn-file-caption:empty{padding-block:0}.bn-inline-content:has(>.ProseMirror-trailingBreak:only-child):before{pointer-events:none;height:0;position:absolute;font-style:italic}[data-text-color=gray]{color:#9b9a97}[data-text-color=brown]{color:#64473a}[data-text-color=red]{color:#e03e3e}[data-text-color=orange]{color:#d9730d}[data-text-color=yellow]{color:#dfab01}[data-text-color=green]{color:#4d6461}[data-text-color=blue]{color:#0b6e99}[data-text-color=purple]{color:#6940a5}[data-text-color=pink]{color:#ad1a72}[data-background-color=gray]{background-color:#ebeced}[data-background-color=brown]{background-color:#e9e5e3}[data-background-color=red]{background-color:#fbe4e4}[data-background-color=orange]{background-color:#faebdd}[data-background-color=yellow]{background-color:#fbf3db}[data-background-color=green]{background-color:#ddedea}[data-background-color=blue]{background-color:#ddebf1}[data-background-color=purple]{background-color:#eae4f2}[data-background-color=pink]{background-color:#f4dfeb}[data-text-alignment=left]{justify-content:flex-start;text-align:left}[data-text-alignment=center]{justify-content:center;text-align:center}[data-text-alignment=right]{justify-content:flex-end;text-align:right}[data-text-alignment=justify]{justify-content:flex-start;text-align:justify}.ProseMirror .tableWrapper{overflow-x:auto}.ProseMirror table{border-collapse:collapse;table-layout:fixed;width:100%;overflow:hidden}.ProseMirror td,.ProseMirror th{vertical-align:top;box-sizing:border-box;position:relative}.ProseMirror .column-resize-handle{position:absolute;right:-2px;top:0;bottom:0;width:4px;z-index:20;background-color:#adf;pointer-events:none}.ProseMirror.resize-cursor{cursor:ew-resize;cursor:col-resize}.ProseMirror .selectedCell:after{z-index:2;position:absolute;content:"";left:0;right:0;top:0;bottom:0;background:#c8c8ff66;pointer-events:none}.bn-editor{outline:none;padding-inline:54px;--N800: #172b4d;--N40: #dfe1e6}.bn-root{-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box}.bn-root *,.bn-root *:before,.bn-root *:after{-webkit-box-sizing:inherit;-moz-box-sizing:inherit;box-sizing:inherit}.bn-default-styles p,.bn-default-styles h1,.bn-default-styles h2,.bn-default-styles h3,.bn-default-styles li{margin:0;padding:0;font-size:inherit;min-width:2px!important}.bn-default-styles{font-size:16px;font-weight:400;font-family:Inter,SF Pro Display,-apple-system,BlinkMacSystemFont,Open Sans,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.bn-table-drop-cursor{position:absolute;z-index:20;background-color:#adf;pointer-events:none}.bn-drag-preview{position:absolute;top:0;left:0;padding:10px;opacity:.001}.collaboration-cursor__caret{border-left:1px solid #0d0d0d;border-right:1px solid #0d0d0d;margin-left:-1px;margin-right:-1px;pointer-events:none;position:relative;word-break:normal}.collaboration-cursor__label{border-radius:3px 3px 3px 0;color:#0d0d0d;font-size:12px;font-style:normal;font-weight:600;left:-1px;line-height:normal;padding:.1rem .3rem;position:absolute;top:-1.4em;-webkit-user-select:none;user-select:none;white-space:nowrap}.bn-editor table{width:auto!important}.bn-editor th,.bn-editor td{min-width:1em;border:1px solid #ddd;padding:3px 5px}.bn-editor .tableWrapper{margin:1em 0}.bn-editor th{font-weight:700;text-align:left}</style>`;
    newhtml += html;

    formPyload.append("subject", subject);
    formPyload.append("html", newhtml);
    formPyload.append("text", text);

    api
      .post("/send", formPyload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((_) => {
        toast.success("Email send successful!");
        closeComposer();
      })
      .catch((_) => {
        toast.error("Email send error!");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const closeComposer = () => {
    setOpen(false);
    if (location.pathname.includes("composer")) router(-1);

    setTimeout(() => {
      removeComposer(composerId);
    }, 150);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          style={{
            marginInline: 12,
            right: rightPos,
            bottom: 0,
            width: 600,
            zIndex: composer?.fullScreen ? 1000 : (composer?.z as number),
          }}
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          animate={composer?.fullScreen ? fullScreenStyle : boxStyle}
          transition={{ ease: "easeInOut", duration: 0.2 }}
          className="bg-background-secondary dark:bg-background text-gray-700 dark:text-gray-100 shadow-2xl dark:shadow-xl dark:shadow-gray-900 pointer-events-auto border border-border h-[600px] w-full absolute flex flex-col rounded-t-lg"
          onMouseDown={() => {
            setActive(composerId);
            incIndex(composerId);
          }}
          onFocus={() => {
            setActive(composerId);
            incIndex(composerId);
          }}
          onClick={() => {
            setActive(composerId);
            incIndex(composerId);
          }}
        >
          <div
            className={cn(
              {
                [!isDragging ? "cursor-move" : "cursor-grabbing"]:
                  !composer?.fullScreen,
              },
              "text-[18px] px-8 pt-5 pb-1 font-medium text-base flex gap-2 justify-between select-none"
            )}
            onMouseDown={() => setIsDragging(true)}
          >
            <div className="text-ellipsis flex whitespace-nowrap overflow-hidden">
              <motion.div
                initial={{ display: "none", opacity: 0 }}
                animate={
                  composer?.fullScreen
                    ? { display: "block", width: "auto", opacity: 1 }
                    : { display: "block", width: 0, opacity: 0 }
                }
                transition={{ ease: "easeInOut", duration: 0.4 }}
              >
                Composer -&nbsp;
              </motion.div>
              <span className="flex-1 text-ellipsis overflow-hidden whitespace-nowrap">
                {subject.trim() != "" ? subject : "New Message"}
              </span>
            </div>
            <div className="flex gap-3 items-center pr-3">
              <Tooltip tip="Minimize">
                <Minus
                  size={20}
                  className="cursor-pointer"
                  onClick={() => {
                    setComposer(composerId, {
                      minimize: composer?.fullScreen
                        ? true
                        : !composer?.minimize,
                      fullScreen: false,
                    });
                    if (location.pathname.includes("composer")) router(-1);
                  }}
                />
              </Tooltip>
              <Tooltip
                tip={
                  !composer?.fullScreen ? "Full Screen" : "Toggle Full Screen"
                }
              >
                {!composer?.fullScreen ? (
                  <ArrowsOutSimple
                    size={20}
                    className="cursor-pointer"
                    onClick={() => {
                      setComposer(composerId, { fullScreen: true });
                      router("/composer");
                    }}
                  />
                ) : (
                  <ArrowsInSimple
                    size={20}
                    className="cursor-pointer"
                    onClick={() => {
                      setComposer(composerId, { fullScreen: false });
                      if (location.pathname.includes("composer")) router(-1);
                    }}
                  />
                )}
              </Tooltip>
              <Tooltip tip="Close">
                <X
                  size={20}
                  className="cursor-pointer"
                  onClick={() => closeComposer()}
                />
              </Tooltip>
            </div>
          </div>
          <div className="text-[15px] px-8 py-3 font border-border border-b">
            <div className="flex gap-3">
              <span className="text-gray-400">From</span>
              <SelectRoot
                value={from}
                onValueChange={(v) => setFrom(v)}
                disabled={loading}
              >
                <SelectTrigger className="p-0 px-3 text-[15px] h-[22px] bg-transparent rounded-l-none !border-none">
                  <SelectValue className="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {userEmails.map((e, i) => {
                      return (
                        <SelectItem key={i} value={e} dontShowCheck>
                          {e}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </SelectRoot>
            </div>
          </div>
          <div className="text-[15px] px-8 py-3 font border-border border-b">
            <div className="flex gap-2">
              <span className="text-gray-400">To</span>
              <EmailSelector
                disabled={loading}
                inputClassName="disabled:!cursor-not-allowed"
                className="pt-[1px]"
                options={searchedEmail}
                inputOnChange={(s) => setSearchItem(s)}
                onChange={(v) => setTo(v)}
                value={to}
              />
            </div>
          </div>
          <div className="text-[15px] px-8 py-3 font border-border border-b">
            <input
              disabled={loading}
              type="text"
              className="w-full bg-transparent outline-none disabled:!cursor-not-allowed"
              placeholder="Subject"
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div className="flex-1 overflow-hidden composer-editor">
            <ScrollArea noShadow>
              <div className={`py-3 h-full`}>

                <Suspense fallback={
                  <div className="h-full w-full flex items-center justify-center">
                    <Spinner />
                  </div>
                }>
                  <BlockEditor
                    onChange={setHtml}
                    theme={allSetting?.appearance?.theme as any}
                  />
                </Suspense>

              </div>
            </ScrollArea>
          </div>
          <div className="text-[15px] px-8 py-3 font border-border border-t flex gap-2">
            <Button
              variant={"primary"}
              loading={loading}
              className="w-fit flex gap-1"
              onClick={() => sendMail()}
            >
              {!loading && <PaperPlaneTilt size={16} />}
              Send
            </Button>
            <Button variant={"toolbutton"} disabled={loading}>
              <Tooltip tip="Schedule Email">
                <ClockCountdown size={20} />
              </Tooltip>
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Composer;
