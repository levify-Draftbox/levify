import BlockEditor from "./editer"
import { useState } from "react"

const BlockEditer = () => {
    const [content, setContent] = useState("")

    const handleChange = (html: string) => {
        setContent(html)
    }

    console.log(content);
    

    return (
        <div className="w-full flex justify-center h-full">
            <div className="w-[50%] h-full">

                <BlockEditor onChange={handleChange} theme="light" />
            </div>
        </div>
    )
}

export default BlockEditer