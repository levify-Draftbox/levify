import useComposerStore from "@/store/composer"
import EmailSelector, { EmailOption } from "./email-input"
import { generateEmailArray } from "./test-email"
import { useEffect, useState } from "react"
import { SelectGroup, SelectItem, SelectRoot, SelectContent, SelectTrigger, SelectValue } from "../ui/select"
import { Button } from "../ui/button"
import { PaperPlaneTilt } from "@phosphor-icons/react"
import ScrollArea from "../ui/ScrollArea"
import { useTheme } from "../Theme-provider"

// block editor
import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { locales } from "@blocknote/core";
import "@blocknote/mantine/style.css";

const Composer: React.FC<{}> = () => {

    const { composers } = useComposerStore()

    return (
        <div className="absolute h-full w-full pointer-events-none">
            {Object.keys(composers).map((cid, i) => {
                return (
                    <ComposerModal key={i} composerId={Number(cid)} />
                )
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
    composerId: number
}> = ({ }) => {
    const { theme } = useTheme()
    const [subject, setSubject] = useState("")

    const [searchItem, setSearchItem] = useState("")
    const [searchedEmail, setSearchedEmail] = useState<EmailOption[]>([])

    useEffect(() => {
        setSearchedEmail(searchEmails(searchItem));
    }, [searchItem])


    // block
    const [_, setHTML] = useState<string>("");
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

        // initialContent: [],
        uploadFile: handleUpload,
    });

    return (
        <div className="bg-background-secondary dark:bg-background text-gray-700 dark:text-gray-100 shadow-2xl dark:shadow-xl dark:shadow-gray-900 pointer-events-auto border border-border h-[600px] w-[600px] absolute right-0 bottom-0 mx-3 flex flex-col rounded-t-lg">
            <div className="text-ellipsis whitespace-nowrap overflow-hidden text-[18px] px-8 pt-5 pb-1 font-medium text-base">
                {subject.trim() != "" ? subject : "New Message"}
            </div>
            <div className="text-[15px] px-8 py-3 font border-border border-b">
                <div className="flex gap-3">
                    <span className="text-gray-400">From</span>
                    <SelectRoot defaultValue="hello@rellitel.ink">
                        <SelectTrigger className="p-0 px-3 text-[15px] h-[22px] bg-transparent rounded-l-none group-focus-within:hover:bg-input-hover">
                            <SelectValue className="" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value={"hello@rellitel.ink"} dontShowCheck>hello@rellitel.ink</SelectItem>
                                <SelectItem value={"hello@rellit.email"} dontShowCheck>hello@rellit.email</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </SelectRoot>
                </div>
            </div>
            <div className="text-[15px] px-8 py-3 font border-border border-b">
                <div className="flex gap-2">
                    <span className="text-gray-400">To</span>
                    <EmailSelector
                        className="pt-[1px]"
                        options={searchedEmail}
                        inputOnChange={(s) => setSearchItem(s)}
                    />
                </div>
            </div>
            <div className="text-[15px] px-8 py-3 font border-border border-b">
                <input type="text" className="w-full bg-transparent outline-none" placeholder="Subject" onChange={(e) => setSubject(e.target.value)} />
            </div>
            <div className="flex-1 overflow-hidden composer-editor">
                <ScrollArea noShadow>
                    <div className={`py-3 `}>
                        <BlockNoteView editor={editor} onChange={onChange} theme={theme as any}
                            filePanel={false}
                        >
                        </BlockNoteView>
                    </div>
                </ScrollArea>
            </div>
            <div className="text-[15px] px-8 py-3 font border-border border-t">
                <Button variant={"primary"} className="w-fit flex gap-1">
                    <PaperPlaneTilt size={16} />
                    Send
                </Button>
            </div>
        </div>
    )
}

export default Composer