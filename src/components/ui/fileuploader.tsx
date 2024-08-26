import { cn } from "@/lib/utils"
import { X } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { DragEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { DefaultExtensionType, FileIcon, defaultStyles } from 'react-file-icon';
import { filesize } from "filesize";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


type FileObject = {
    file: File,
    id: string
    name: string,
    status: 'success' | 'error' | 'loading',
    loading: number
    size: number
}

type FileUploadBlockProp = {
    endPoint: string
    placeHolder?: string
    placeHolderClass?: string
    thumbClassName?: string
    maxWidth?: number
    fileIconSize?: number
    tileSize?: number
    uploadFormData?: FormData
}

const FileUploadBlock: React.FC<Partial<HTMLDivElement> & FileUploadBlockProp> = ({
    endPoint,
    className,
    placeHolder = "Drage n drop file!",
    placeHolderClass,
    thumbClassName,
    maxWidth = 220,
    fileIconSize = 24,
    tileSize = 50,
    uploadFormData = new FormData()
}) => {
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [droppedFiles, setDroppedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [files, setfiles] = useState<FileObject[]>([])

    const handleZoneClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const files: File[] = Array.from(event.target.files);
            let fn: FileObject[] = files.map((f, i) => {
                let id = generateUniqueId() + "_" + i
                uploadFile(id, f)
                return { file: f, id: id, loading: 0, name: f.name, status: 'loading', size: f.size }
            })
            setfiles(f => [...f, ...fn]);

            event.target.files = null
            event.target.value = ""
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files: File[] = Array.from(e.dataTransfer.files);
        let fn: FileObject[] = files.map((f, i) => {
            let id = generateUniqueId() + "_" + i
            uploadFile(id, f)
            return { file: f, id: id, loading: 0, name: f.name, status: 'loading', size: f.size }
        })
        setfiles(f => [...f, ...fn]);
    };

    const removeFile = (i: number) => {
        setfiles((f) => {
            let s = f.slice(0, i)
            let e = f.slice(i + 1)
            return [...s, ...e]
        })
    }

    useEffect(() => {
        console.log(droppedFiles);
    }, [droppedFiles])

    const uploadFile = (id: string, file: File) => {
                
    }

    return (
        <div
            onClick={(e: MouseEvent<HTMLDivElement>) => {
                let t = e.target as HTMLElement
                if (t.classList.contains("file-drag-zone")) handleZoneClick()
            }}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={cn(
                "min flex flex-wrap relative overflow-auto scroll-bar h gap-2 p-2 file-drag-zone",
                className
            )}>

            {
                files.length == 0 &&
                <span className={cn(
                    "w-fit flex m-auto text-gray-400 dark:text-gray-500",
                    placeHolderClass
                )}>
                    {placeHolder}
                </span>
            }

            {files.map((f, i) => {
                let fnameSplit = f.name.includes(".") ? f.name.split(".") : ["file"]
                let ext = fnameSplit[fnameSplit.length - 1]

                return (
                    <div key={i}
                        style={{
                            maxWidth: maxWidth,
                            height: tileSize
                        }}
                        className="flex-shrink-0 bg-white dark:bg-input border shadow-sm rounded-sm flex items-center px-2 gap-2 overflow-hidden"
                    >
                        <div className="h-full file-upload-icon flex-shrink-0" style={{
                            width: fileIconSize,
                            maxWidth: fileIconSize
                        }}>
                            {
                                f.status == "success" ?
                                    <FileIcon extension={ext} {...defaultStyles[ext as DefaultExtensionType]} /> :
                                    <CircularProgressbar
                                        value={66} strokeWidth={14}
                                        className="loader"
                                    />
                            }
                        </div>

                        <div className="flex-1 overflow-hidden">
                            <div className="whitespace-nowrap text-[13px] text-ellipsis overflow-hidden w-full text-gray-600 dark:text-gray-300">
                                {f.name}
                            </div>
                            <div className="text-[10px] p-0 m-0">
                                {filesize(f.size, { standard: "jedec" })}
                            </div>
                        </div>
                        <div onClick={() => removeFile(i)} className="cursor-pointer p-1 rounded-sm hover:bg-button dark:hover:bg-button-hover">
                            <X className="w-[14px]" />
                        </div>
                    </div>
                )
            })
            }

            {isDragging &&
                <AnimatePresence>
                    <div className="absolute w-full h-full p-1 pointer-events-none top-0 left-0">
                        <motion.div className={cn(
                            "bg-w bg-gray-500 dark:bg-white w-full h-full rounded-md",
                            thumbClassName
                        )} />
                    </div>
                </AnimatePresence>
            }

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                multiple
            />
        </div>
    )
}

function generateUniqueId(): string {
    const timestamp = Date.now(); // Get the current timestamp in milliseconds
    const randomString = Math.random().toString(36).substr(2, 9); // Generate a random alphanumeric string
    return `${timestamp}-${randomString}`;
}

export default FileUploadBlock