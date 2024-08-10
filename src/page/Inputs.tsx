import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import React, { useState } from "react";

function Inputs(): React.ReactNode {

    const [selectValue, setSelectValue] = useState("hello")

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
                    <PhoneInput placeholder="Phone No" defaultCountry="IN" label="Phone No" />
                </div>

                <div className="px-4 py-3">
                    <Button className="">Submit</Button>
                </div>
                <div className="px-4 py-1">
                    <Button className="" variant={"secondary"}>Submit</Button>
                </div>
            </div>
        </>
    )
}

export default Inputs