import { cn } from "@/lib/utils"
import { Warning, X } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "framer-motion";
import { DragEvent, MouseEvent, useRef, useState } from "react";
import { DefaultExtensionType, FileIcon, defaultStyles } from 'react-file-icon';
import { filesize } from "filesize";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import api from "@/lib/api";

export type FileObject = {
    // file: File,
    id: string
    name: string,
    status: 'success' | 'error' | 'loading',
    loading: number
    size: number
    uid: string
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
    setFiles?: React.Dispatch<React.SetStateAction<FileObject[]>>
    files?: FileObject[]
    row?: boolean
    sizeLimit?: number
    setLimitModal?: React.Dispatch<React.SetStateAction<boolean>>
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
    uploadFormData = new FormData(),
    setFiles,
    files,
    row,
    sizeLimit,
    setLimitModal,
}) => {
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const handleZoneClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            addFile(event.target.files);
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

        addFile(e.dataTransfer.files)
    };

    const removeFile = (i: number) => {
        setFiles && setFiles((f) => {
            let s = f.slice(0, i)
            let e = f.slice(i + 1)
            return [...s, ...e]
        })
    }

    const addFile = (fl: FileList) => {
        const fs: File[] = Array.from(fl);
        let fSize = files?.reduce((r, j) => r + (j.status != "error" ? j.size : 0), 0) || 0

        let fn: FileObject[] = fs.map((f, i) => {
            let id = generateUniqueId() + "_" + i

            if (sizeLimit) {
                if (fSize + f.size > sizeLimit) {
                    setLimitModal && setLimitModal(true)
                    return { id: id, loading: 0, name: f.name, status: 'error', size: f.size, uid: "" }
                }
            }

            fSize += f.size

            uploadFile(id, f)
            return { /* file: f, */ id: id, loading: 0, name: f.name, status: 'loading', size: f.size, uid: "" }
        })

        setFiles && setFiles(f => [...f, ...fn]);
    }

    const uploadFile = (id: string, file: File) => {

        let form = new FormData()
        uploadFormData.forEach((value, key) => {
            form.set(key, value);
        });
        form.set("file_id", id)
        form.set("file", file)

        api.post(endPoint, form, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (e) => {
                const { loaded, total } = e;
                if (total) {
                    const percentage = Math.round((loaded * 100) / total);
                    setFiles && setFiles(f => f.map(f => {
                        if (f.id == id) {
                            f.loading = percentage
                        }
                        return f
                    }))
                }
            }
        }).then((s) => {
            setFiles && setFiles(f => f.map(f => {
                if (f.id == id) {
                    f.loading = 100
                    f.status = s.data.uid ? 'success' : "error"
                    f.uid = s.data.uid
                    f.size = s.data.uid ? f.size : 0
                }
                return f
            }))
        }).catch(_ => {
            setFiles && setFiles(f => f.map(f => {
                if (f.id == id) {
                    f.loading = 0
                    f.status = 'error'
                    f.size = 0
                }
                return f
            }))
        })
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
                "min flex relative overflow-auto scroll-bar h gap-2 p-2 file-drag-zone",
                row ? "" : "flex-wrap",
                className
            )}>

            {
                (!files || files.length == 0) &&
                <span className={cn(
                    "w-fit flex m-auto text-gray-400 dark:text-gray-500 pointer-events-none",
                    placeHolderClass
                )}>
                    {placeHolder}
                </span>
            }

            {files?.map((f, i) => {
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
                                    f.status == "error" ?
                                        <Warning className="text-red-500 w-full" /> :
                                        <CircularProgressbar
                                            value={f.loading} strokeWidth={14}
                                            className="loader"
                                        />
                            }
                        </div>

                        <div className="flex-1 overflow-hidden">
                            <div className={cn(
                                "whitespace-nowrap text-[13px] text-ellipsis overflow-hidden w-full text-gray-600 dark:text-gray-300",
                                {
                                    "!text-red-500": f.status == 'error'
                                }
                            )}>
                                {f.name}
                            </div>
                            <div className={cn(
                                "text-[10px] p-0 m-0",

                            )}>
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