import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import useloadInboxModal from "@/store/loadinbox";
import React, { useEffect, useState } from "react";

function Inputs(): React.ReactNode {

    const [selectValue, setSelectValue] = useState("hello")
    const { setLoad: loadInbox } = useloadInboxModal()

    useEffect(() => {
        loadInbox()
    }, [])

    return (
        <>
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

                <div className="flex px-4 gap-2">
                    <Button className="">Submit</Button>
                    <Button className="" variant={"secondary"}>Submit</Button>
                </div>

                <div className="px-4 py-4">
                    <Button className="" size={"lg"}>Submit</Button>
                </div>
            </div>
        </>
    )
}

export default Inputs