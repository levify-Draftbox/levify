import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import FileUploadBlock, { FileObject } from "@/components/ui/fileuploader";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone";
import ResizeableModel from "@/components/ui/ResizeableModel";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import useloadInboxModal from "@/store/loadinbox";
import { TextBolder, TextItalic, TextUnderline } from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
function Inputs(): React.ReactNode {

    const [selectValue, setSelectValue] = useState("hello")
    const { setLoad: loadInbox } = useloadInboxModal()

    useEffect(() => {
        loadInbox()
    }, [])

    const [files, setFiles] = useState<FileObject[]>([{
        id: "sd",
        loading: 100,
        name: "hello.pdf",
        size: 2000,
        status: "success",
        uid: ""
    }])
    useEffect(() => {
        console.log(files);
    }, [files])

    const [showNightFall, setNightFall] = useState(false)

    return (
        <>
            <div className="overflow-auto scroll-bar w-full ">
                <div className="max-w-[500px]">
                    <div className="px-4 py-1">
                        <Input label="Username" placeholder="User Name" />
                    </div>
                    <div className="px-4 py-1">
                        <Input label="Password" placeholder="Password" type="password" />
                    </div>

                    <div className="px-4 py-1">
                        <Select label="Select `Select`">
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select a fruit" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel dontShowCheck>Fruits</SelectLabel>
                                    <SelectItem value="apple" dontShowCheck>Apple</SelectItem>
                                    <SelectItem value="banana" dontShowCheck>Banana</SelectItem>
                                    <SelectItem value="blueberry" dontShowCheck>Blueberry</SelectItem>
                                    <SelectItem value="grapes" dontShowCheck>Grapes</SelectItem>
                                    <SelectItem value="pineapple" dontShowCheck>Pineapple</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>


                    <div className="px-4 py-1">
                        <Input
                            label="Email Address"
                            type="text"
                            id="Email"
                            option={{
                                hi: "@rellit.email",
                                hello: "@rellitl.ink",
                            }}
                            optionName="Domains"
                            placeholder="Username"
                            optionValue={selectValue}
                            optionLabel="Select Domain"
                            onOptionChange={(s) => setSelectValue(s)}
                            value={"qewe"}
                        />
                    </div>

                    <div className="px-4 py-1">
                        <Input
                            label="Email Address"
                            type="text"
                            id="Email"
                            option={{
                                hi: "@rellit.email",
                                hello: "@rellitl.ink",
                            }}
                            optionName="Domains"
                            placeholder="Username"
                            optionValue={selectValue}
                            optionLabel="Select Domain"
                            onOptionChange={(s) => setSelectValue(s)}
                            value={"qewe"}
                            optionPosition="item-aligned"
                        />
                    </div>

                    <div className="px-4 py-1">
                        <PhoneInput placeholder="Phone No" defaultCountry="IN" label="Phone No" />
                    </div>

                    <div className="items-top flex space-x-2 px-4 py-4">
                        <Checkbox id="terms1" />
                        <div className="grid gap-1.5 leading-none">
                            <label
                                htmlFor="terms1"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Accept terms and conditions
                            </label>
                            <p className="text-sm text-muted-foreground">
                                You agree to our Terms of Service and Privacy Policy.
                            </p>
                        </div>
                    </div>

                    <div className="mx-4 py-2 my-4">
                        <FileUploadBlock
                            endPoint="/fileupload"
                            placeHolder="Upload File!"
                            className={"min-h-[58px] h-auto bg-background rounded-md border border-input-border"}
                            thumbClassName={"rounded-sm bg-gray-300/30 dark:bg-gray-300/5 border-2 border-dashed border-input-border !border-core"}
                            fileIconSize={24}
                            tileSize={40}
                            files={files}
                            setFiles={setFiles}
                            sizeLimit={31457280}
                            setLimitModal={setNightFall}
                        />
                    </div>

                    <div className="mx-4 py-2 my-4">
                        <ToggleGroup type="single">
                            <ToggleGroupItem value="bold" aria-label="Toggle bold">
                                <TextBolder className="h-4 w-4" />
                            </ToggleGroupItem>
                            <ToggleGroupItem value="italic" aria-label="Toggle italic">
                                <TextItalic className="h-4 w-4" />
                            </ToggleGroupItem>
                            <ToggleGroupItem value="underline" aria-label="Toggle underline">
                                <TextUnderline className="h-4 w-4" />
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>

                    <div className="flex px-4 gap-2">
                        <Button className="">Submit</Button>
                        <Button className="" variant={"secondary"}>Submit</Button>
                    </div>

                    <div className="px-4 py-4">
                        <Button className="" size={"lg"}>Submit</Button>
                    </div>

                    {showNightFall && (
                        <ResizeableModel
                            key="model"
                            size={{ width: "30%", height: "15%" }}
                            onClose={() => setNightFall(false)}
                        >
                            <div className="p-6 w-full h-full">
                                <h1 className={`text-2xl font-[500] `}>
                                    <p>Max Size</p>
                                </h1>
                                <div className="text-sm mt-3 font-thin text-gray-700 dark:text-gray-200">
                                    night flow of file!
                                </div>
                                <div className="mt-4 flex justify-end items-end">
                                    <Button variant={"primary"} onClick={() => { }} className="w-32" >Try again</Button>
                                </div>
                            </div>
                        </ResizeableModel>
                    )}
                </div>
            </div>
        </>
    )
}

export default Inputs