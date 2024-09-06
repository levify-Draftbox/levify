import BlockEditor from "./editer"
import { useState } from "react"
import { useProfileStore } from "@/store/profile"
import { DotsThree, Star } from "@phosphor-icons/react"

const BlockEditer = () => {
    const [content, setContent] = useState("")
    const { allSetting } = useProfileStore();

    const theme = allSetting?.appearance?.theme || "system"

    const handleChange = (html: string) => {
        setContent(html)
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

export default BlockEditer