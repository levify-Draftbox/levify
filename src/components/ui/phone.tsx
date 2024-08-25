import { CheckIcon, ChevronsUpDown } from "lucide-react";

import * as React from "react";

import * as RPNInput from "react-phone-number-input";

import flags from "react-phone-number-input/flags";

import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { Input, InputProps } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import { ScrollArea } from "./scroll-area";
import { AnimatePresence, motion } from "framer-motion";

type PhoneInputProps = Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value"
> &
    Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
        onChange?: (value: RPNInput.Value) => void;
    } & {
        error?: string
        label?: string  
    }

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> =
    React.forwardRef<React.ElementRef<typeof RPNInput.default>, PhoneInputProps>(
        ({ className, onChange, error, label, ...props }, ref) => {
            return (
                <div>
                    {
                        label &&
                        <label htmlFor={label} className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-white">{label}</label>
                    }

                    <div
                        className={cn(
                            label ? "mt-1" : "",
                            "overflow-hidden rounded-lg flex group border focus-within:!border-core border-input-border hover:border-input-border-hover",
                            className
                        )
                        }>
                        <RPNInput.default
                            ref={ref}
                            className={cn("flex w-full", className)}
                            flagComponent={FlagComponent}
                            countrySelectComponent={CountrySelect}
                            inputComponent={InputComponent}
                            /**
                             * Handles the onChange event.
                            *
                            * react-phone-number-input might trigger the onChange event as undefined
                            * when a valid phone number is not entered. To prevent this,
                            * the value is coerced to an empty string.
                            *
                            * @param {E164Number | undefined} value - The entered value
                            */
                            onChange={(value) => onChange?.(value as any)}
                            {...props}
                        />
                    </div>

                    {
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{
                                        opacity: 0,
                                        height: 0,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        height: "auto",
                                    }}
                                    exit={{
                                        opacity: 0,
                                        height: 0,
                                    }}
                                    transition={{ ease: "easeOut", duration: 0.3 }}
                                >
                                    <motion.span className="text-red-500 text-sm  block mt-1">
                                        {error}
                                    </motion.span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    }
                </div>
            );
        },
    );
PhoneInput.displayName = "PhoneInput";

const InputComponent = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, ...props }, ref) => (
        <Input
            inputClass="pl-2"
            className={cn(
                "h-[32px]",
                "!border-none !rounded-none w-full bg-transparent", className
            )}
            {...props}
            ref={ref}
        />
    ),
);
InputComponent.displayName = "InputComponent";

type CountrySelectOption = { label: string; value: RPNInput.Country };

type CountrySelectProps = {
    disabled?: boolean;
    value: RPNInput.Country;
    onChange: (value: RPNInput.Country) => void;
    options: CountrySelectOption[];
};

const CountrySelect = ({
    disabled,
    value,
    onChange,
    options,
}: CountrySelectProps) => {
    const handleSelect = React.useCallback(
        (country: RPNInput.Country) => {
            onChange(country);
        },
        [onChange],
    );

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"secondary"}
                    className={cn("flex gap-1 h-[32px] rounded-none px-3 py-6 w-fit !bg-transparent hover:!bg-transparent border-none")}
                    disabled={disabled}
                >
                    <FlagComponent country={value} countryName={value} />
                    <ChevronsUpDown
                        className={cn(
                            "-mr-2 h-4 w-4 opacity-50",
                            disabled ? "hidden" : "opacity-100",
                        )}
                    />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandList>
                        <ScrollArea className="h-72">
                            <CommandInput placeholder="Search country..." />
                            <CommandEmpty>No country found.</CommandEmpty>
                            <CommandGroup>
                                {options
                                    .filter((x) => x.value)
                                    .map((option) => (
                                        <CommandItem
                                            className="gap-2"
                                            key={option.value}
                                            onSelect={() => handleSelect(option.value)}
                                        >
                                            <FlagComponent
                                                country={option.value}
                                                countryName={option.label}
                                            />
                                            <span className="flex-1 text-sm">{option.label}</span>
                                            {option.value && (
                                                <span className="text-foreground/50 text-sm">
                                                    {`+${RPNInput.getCountryCallingCode(option.value)}`}
                                                </span>
                                            )}
                                            <CheckIcon
                                                className={cn(
                                                    "ml-auto h-4 w-4",
                                                    option.value === value ? "opacity-100" : "opacity-0",
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                            </CommandGroup>
                        </ScrollArea>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
    const Flag = flags[country];

    return (
        <span className="bg-foreground/20 flex h-5 w-6 overflow-hidden rounded-sm">
            {Flag && <Flag title={countryName} />}
        </span>
    );
};
FlagComponent.displayName = "FlagComponent";

export { PhoneInput };
