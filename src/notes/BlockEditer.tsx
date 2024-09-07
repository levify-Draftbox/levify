import BlockEditor from "./editer"
import { useState, useCallback } from "react"
import { useProfileStore } from "@/store/profile"
import { DotsThree, Star } from "@phosphor-icons/react"
import api from "@/lib/api"

const BlockEditer = () => {
    const [content, setContent] = useState("")
    const { allSetting } = useProfileStore();

    const theme = allSetting?.appearance?.theme || "system"

    // Debounced save function
    const debouncedSave = useCallback(
        debounce((content: string) => {
            api.post("/notes/note", { content })
                .then(response => console.log("Note saved:", response.data))
                .catch(error => console.error("Error saving note:", error));
        }, 4000),
        []
    );

    const handleChange = (html: string) => {
        setContent(html)
        debouncedSave(html)
    }


    console.log(content);


    return (
        <div className="w-full flex  h-full flex-col">
            <div className="w-full h-8  flex items-center justify-end px-3 gap-3">
                
            <Star size={18} />

            <DotsThree size={22} weight="bold" />
            </div>
            <div className="w-full h-full flex justify-center">

                <div className="w-[50%] h-full">
                    <BlockEditor onChange={handleChange} theme={theme} />
                </div>
            </div>
        </div>
    )
}

// Debounce helper function
function debounce(func: Function, wait: number) {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: any[]) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export default BlockEditer