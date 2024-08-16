import useComposerStore from "@/store/composer"
import EmailSelector, { EmailOption, emailRegex } from "./email-input"
import { generateEmailArray } from "./test-email"
import { useEffect, useState } from "react"
import { SelectGroup, SelectItem, SelectRoot, SelectContent, SelectTrigger, SelectValue } from "../ui/select"
import { Button } from "../ui/button"
import { ArrowsInSimple, ArrowsOutSimple, ClockCountdown, Minus, PaperPlaneTilt, X } from "@phosphor-icons/react"
import ScrollArea from "../ui/ScrollArea"
import { motion, AnimatePresence, VariantLabels, AnimationControls, TargetAndTransition } from "framer-motion"
import { useLocation, useNavigate } from 'react-router-dom';

// block editor
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { locales } from "@blocknote/core";
import "@blocknote/mantine/style.css";
import { Tooltip } from "../ui/tooltip"
import { cn } from "@/lib/utils"
import { useSettingsStore } from "@/store/SettingStore"
import { htmlToText } from "html-to-text"
import { toast } from "sonner"
import api from "@/lib/api"

type StyleProps = boolean | VariantLabels | AnimationControls | TargetAndTransition

const Composer: React.FC<{}> = () => {

    const { composers } = useComposerStore()

    return (
        <div className="absolute h-full w-full pointer-events-none">
            {Object.keys(composers).map((cid, i) => {
                if (composers[cid]) {
                    return (
                        <ComposerModal key={i} composerId={cid} />
                    )
                }
            })}
        </div>
    )
}

const emails = generateEmailArray(120)
function searchEmails(query: string): EmailOption[] {
    if (query.trim() === "") {
        return emails.slice(0, 5);
    }

    const lowercaseQuery = query.toLowerCase();
    const filteredEmails = emails.filter(email =>
        email.email.toLowerCase().includes(lowercaseQuery) ||
        (email.name && email.name.toLowerCase().includes(lowercaseQuery))
    );

    return filteredEmails.slice(0, 5);
}

const ComposerModal: React.FC<{
    composerId: string
}> = ({ composerId }) => {
    const {
        removeComposer,
        composers: allComposer,
        setComposer,
        activeid: composerActive,
        setActive,
        incIndex,
        parentSize,
    } = useComposerStore()
    const composer = allComposer[composerId]

    const location = useLocation();
    const router = useNavigate()

    useEffect(() => {
        if (!location.pathname.includes("composer"))
            setComposer(composerId, { fullScreen: false })
        else if (composerActive == composerId)
            setComposer(composerId, { fullScreen: true })
    }, [location]);

    const [open, setOpen] = useState(true)

    const { allSetting } = useSettingsStore()

    const [searchItem, setSearchItem] = useState("")
    const [searchedEmail, setSearchedEmail] = useState<EmailOption[]>([])

    useEffect(() => {
        setSearchedEmail(searchEmails(searchItem));
    }, [searchItem])

    const [emailHtml, setHTML] = useState<string>("");
    const onChange = async () => {
        const html = await editor.blocksToHTMLLossy(editor.document);
        setHTML(html);
    };

    const handleUpload = async (file: File) => {
        return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                resolve(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        });
    };
    // const  = useDictionary()
    const editor = useCreateBlockNote({
        dictionary: {
            ...locales.en,
            placeholders: {
                ...locales.en.placeholders,
                default: "Write Message, Select to format!" || locales.en.placeholders.default,
            },
        },

        initialContent: [{ "id": "b2102490-c742-4bc5-9f1a-f40ae92e3777", "type": "paragraph", "props": { "textColor": "default", "backgroundColor": "default", "textAlignment": "left" }, "content": [], "children": [] }, { "id": "43464316-31fc-4257-82e8-8f08d78ed7af", "type": "paragraph", "props": { "textColor": "default", "backgroundColor": "default", "textAlignment": "left" }, "content": [], "children": [] }, { "id": "28ca1da0-f19e-4af7-af2c-ffcd9d9a1433", "type": "paragraph", "props": { "textColor": "default", "backgroundColor": "default", "textAlignment": "left" }, "content": [{ "type": "text", "text": "Email send from ", "styles": { "textColor": "red" } }, { "type": "link", "href": "http://dev.rellitel.ink/", "content": [{ "type": "text", "text": "DraftBox Beta", "styles": { "textColor": "red" } }] }, { "type": "text", "text": ", So don't trust!", "styles": { "textColor": "red" } }], "children": [] }, { "id": "85259461-c0fe-4a9d-967c-3ea27689a998", "type": "paragraph", "props": { "textColor": "default", "backgroundColor": "default", "textAlignment": "left" }, "content": [], "children": [] }],
        uploadFile: handleUpload,
    });

    const commonStyle: StyleProps = {
        ...composerActive == composerId ? { filter: "brightness(100%)" } : { filter: "brightness(90%)" },
    }

    const [isDragging, setIsDragging] = useState(false);
    const [rightPos, setRightPos] = useState(0);

    const [maxRight, setMaxRight] = useState(parentSize - 600 - 12 * 2)
    useEffect(() => setMaxRight(parentSize - 600 - 12 * 2), [parentSize])
    useEffect(() => setRightPos(rightPos >= maxRight ? maxRight : rightPos), [maxRight])

    const handleMouseMove = (e: any) => {
        if (!isDragging) return;
        setRightPos(prevRightPos => {
            return prevRightPos - e.movementX <= 0 ? 0 : (
                prevRightPos - e.movementX >= maxRight ? maxRight : prevRightPos - e.movementX
            )
        });
        setComposer(composerId, {
            x: rightPos - e.movementX <= 0 ? 0 : (
                rightPos - e.movementX >= maxRight ? maxRight : rightPos - e.movementX
            )
        })
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);


    const boxStyle: StyleProps = {
        opacity: 1,
        width: 600,
        margin: "0 12px",
        bottom: composer?.fullScreen ? 0 : (composer?.minimize ? -600 + 60 : 0),

        ...commonStyle,
    }

    const fullScreenStyle: StyleProps = {
        width: "100%",
        height: "100%",
        margin: "0",
        opacity: 1,
        border: "none",
        right: 0,
        bottom: composer?.fullScreen ? 0 : (composer?.minimize ? -600 + 48 : 0),

        ...commonStyle,
    }

    const [from, setFrom] = useState("dev.hello@myworkspacel.ink")
    const [to, setTo] = useState<{ email: string }[]>([])
    const [subject, setSubject] = useState("")
    const [loading, setIsLoading] = useState(false)

    const sendMail = () => {
        setIsLoading(true)

        let onlyToArr = to.map(t => t.email)

        if (to.length == 0) {
            toast.info(`Enter To first!`)
            setIsLoading(false)
            return
        }

        if (subject.trim() == "") {
            toast.info(`Enter Subject fist!`)
            setIsLoading(false)
            return
        }

        let formPyload = new FormData()
        formPyload.append("from", from)

        let errOnEmail = false
        onlyToArr.map(e => {
            if (!emailRegex.test(e)) {
                errOnEmail = true
                toast.error(`Invalid Email in To ${e}`)
            } else {
                formPyload.append("to", e)
            }
        })
        if (errOnEmail) {
            setIsLoading(false)
            return
        }


        const text = htmlToText(emailHtml, {
            wordwrap: 130
        });

        formPyload.append("subject", subject)
        formPyload.append("html", emailHtml)
        formPyload.append("text", text)

        api.post("/message/send-mail", formPyload, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }).then(_ => {
            toast.success("Email send successful!");
            closeComposer()
        }).catch(_ => {
            toast.error("Email send error!");
        }).finally(() => {
            setIsLoading(false)
        })

    }

    const closeComposer = () => {
        setOpen(false)
        if (location.pathname.includes("composer")) router(-1)

        setTimeout(() => {
            removeComposer(composerId)
        }, 150)
    }


    return (
        <AnimatePresence>
            {open &&
                <motion.div

                    style={{
                        marginInline: 12,
                        right: rightPos,
                        bottom: 0,
                        width: 600,
                        zIndex: composer?.fullScreen ? 1000 : composer?.z as number,
                    }}

                    initial={{ opacity: 0, }}
                    exit={{ opacity: 0 }}
                    animate={composer?.fullScreen ? fullScreenStyle : boxStyle}

                    transition={{ ease: "easeInOut", duration: .2 }}
                    className="bg-background-secondary dark:bg-background text-gray-700 dark:text-gray-100 shadow-2xl dark:shadow-xl dark:shadow-gray-900 pointer-events-auto border border-border h-[600px] w-full absolute flex flex-col rounded-t-lg"

                    onMouseDown={() => {
                        setActive(composerId)
                        incIndex(composerId)
                    }}
                    onFocus={() => {
                        setActive(composerId)
                        incIndex(composerId)
                    }}
                    onClick={() => {
                        setActive(composerId)
                        incIndex(composerId)
                    }}
                >
                    <div className={cn(
                        { [!isDragging ? "cursor-move" : "cursor-grabbing"]: !composer?.fullScreen },
                        "text-[18px] px-8 pt-5 pb-1 font-medium text-base flex gap-2 justify-between select-none"
                    )}
                        onMouseDown={() => setIsDragging(true)}
                    >
                        <div className="text-ellipsis flex whitespace-nowrap overflow-hidden">
                            <motion.div
                                initial={{ display: "none", opacity: 0 }}
                                animate={composer?.fullScreen ? { display: "block", width: "auto", opacity: 1 } : { display: "block", width: 0, opacity: 0 }}
                                transition={{ ease: "easeInOut", duration: .4 }}
                            >
                                Composer -
                            </motion.div>
                            &nbsp;
                            <span className="flex-1 text-ellipsis overflow-hidden whitespace-nowrap">
                                {subject.trim() != "" ? subject : "New Message"} {composerId}
                            </span>
                        </div>
                        <div className="flex gap-3 items-center pr-3">
                            <Tooltip tip="Minimize">
                                <Minus size={20} className="cursor-pointer" onClick={() => {
                                    setComposer(composerId, { minimize: composer?.fullScreen ? true : !composer?.minimize, fullScreen: false })
                                    if (location.pathname.includes("composer")) router(-1)
                                }} />
                            </Tooltip>
                            <Tooltip tip={!composer?.fullScreen ? "Full Screen" : "Toggle Full Screen"}>
                                {!composer?.fullScreen ?
                                    <ArrowsOutSimple size={20} className="cursor-pointer" onClick={() => {
                                        setComposer(composerId, { fullScreen: true })
                                        router("/composer")
                                    }} />
                                    : <ArrowsInSimple size={20} className="cursor-pointer" onClick={() => {
                                        setComposer(composerId, { fullScreen: false })
                                        if (location.pathname.includes("composer")) router(-1)
                                    }} />
                                }
                            </Tooltip>
                            <Tooltip tip="Close">
                                <X size={20} className="cursor-pointer" onClick={() => closeComposer()} />
                            </Tooltip>
                        </div>
                    </div>
                    <div className="text-[15px] px-8 py-3 font border-border border-b">
                        <div className="flex gap-3">
                            <span className="text-gray-400">From</span>
                            <SelectRoot value={from} onValueChange={(v) => setFrom(v)} disabled={loading}>
                                <SelectTrigger className="p-0 px-3 text-[15px] h-[22px] bg-transparent rounded-l-none group-focus-within:hover:bg-input-hover">
                                    <SelectValue className="" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value={"dev.hello@myworkspacel.ink"} dontShowCheck>dev.hello@myworkspacel.ink</SelectItem>
                                        <SelectItem value={"dev.hello@cockatielone.biz"} dontShowCheck>dev.hello@cockatielone.biz</SelectItem>
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
                        <input disabled={loading} type="text" className="w-full bg-transparent outline-none disabled:!cursor-not-allowed" placeholder="Subject" onChange={(e) => setSubject(e.target.value)} />
                    </div>
                    <div className="flex-1 overflow-hidden composer-editor">
                        <ScrollArea noShadow>
                            <div className={`py-3 `}>
                                <BlockNoteView editor={editor} onChange={onChange} theme={allSetting?.appearance?.theme as any}
                                    filePanel={false}
                                >
                                </BlockNoteView>
                            </div>
                        </ScrollArea>
                    </div>
                    <div className="text-[15px] px-8 py-3 font border-border border-t flex gap-2">
                        <Button variant={"primary"} loading={loading} className="w-fit flex gap-1" onClick={() => sendMail()}>
                            {!loading &&
                                < PaperPlaneTilt size={16} />
                            }
                            Send
                        </Button>
                        <Button variant={"toolbutton"} disabled={loading}>
                            <Tooltip tip="Schedule Email">
                                <ClockCountdown size={20} />
                            </Tooltip>
                        </Button>
                    </div>
                </motion.div>
            }
        </AnimatePresence>
    )
}

export default Composer