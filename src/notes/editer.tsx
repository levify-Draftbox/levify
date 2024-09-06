import "@blocknote/core/fonts/inter.css";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { locales } from "@blocknote/core";
import "@blocknote/mantine/style.css";

type BlockEditorProps = {
    onChange: (s: string) => void
    theme: string
}
export default function BlockEditor({ onChange, theme }: BlockEditorProps) {

    const onEditorChange = async () => {
        const html = await editor.blocksToFullHTML(editor.document);
        onChange(html);
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

    const editor = useCreateBlockNote({
        dictionary: {
            ...locales.en,
            placeholders: {
                ...locales.en.placeholders,
                default:
                    "Write Message, Select to format!" || locales.en.placeholders.default,
            },
        },

        initialContent: [
            {
                type: "heading",
                props: {
                    textColor: "default",
                    backgroundColor: "default",
                    textAlignment: "left",
                    level: 1,
                },
                children: [],
            },
            {
                id: "b2102490-c742-4bc5-9f1a-f40ae92e3777",
                type: "paragraph",
                props: {
                    textColor: "default",
                    backgroundColor: "default",
                    textAlignment: "left",
                },
                content: [],
                children: [],
            },
            {
                id: "43464316-31fc-4257-82e8-8f08d78ed7af",
                type: "paragraph",
                props: {
                    textColor: "default",
                    backgroundColor: "default",
                    textAlignment: "left",
                },
                content: [],
                children: [],
            },
            {
                id: "28ca1da0-f19e-4af7-af2c-ffcd9d9a1433",
                type: "paragraph",
                props: {
                    textColor: "default",
                    backgroundColor: "default",
                    textAlignment: "left",
                },
                children: [],
            },
            {
                id: "85259461-c0fe-4a9d-967c-3ea27689a998",
                type: "paragraph",
                props: {
                    textColor: "default",
                    backgroundColor: "default",
                    textAlignment: "left",
                },
                content: [],
                children: [],
            },
        ],
        uploadFile: handleUpload,
    });

    return (
        <div className="w-full h-full mt-20">

            <BlockNoteView
                editor={editor}
                onChange={onEditorChange}
                theme={theme as any}
                filePanel={false}
            />
        </div>
    )
}