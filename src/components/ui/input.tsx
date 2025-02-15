import * as React from "react";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { SelectContent, SelectGroup, SelectItem, SelectLabel, SelectRoot, SelectTrigger, SelectValue } from "./select";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
  variant?: string;
  inputClass?: string;

  option?: { [_: string]: string };
  optionLabel?: string
  optionName?: string
  optionValue?: string
  onOptionChange?: (_: string) => void
  optionPosition?: 'item-aligned' | 'popper';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, variant, label, optionPosition, ...props }, ref) => {

    const [inputType, setInputType] = React.useState(type || "input")

    return (
      <>
        {
          label &&
          <label htmlFor={label} className="text-sm  leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-white">{label}</label>
        }

        <div
          className={cn(
            "h-[34px]",
            label ? "mt-[6px]" : "",
            "overflow-hidden rounded-md flex group border-[1px] border-input-border transition-colors duration-100 hover:border-input-border-hover focus-within:!border-core",
            className
          )
          }>
          <input
            type={inputType}
            className={cn(
              Object.keys(props.option || {}).length > 0 ? "pr-1" : "pr-4",
              "flex w-full bg-transparent !outline-none pl-3 py-[6px] text-[.8rem] file:border-0 file:bg-transparent text-gray-700 dark:text-white file:text-sm file:font-medium placeholder:text-gray-400 dark:placeholder:text-gray-200 disabled:cursor-not-allowed disabled:opacity-50 ",
              props.inputClass
            )}
            ref={ref}
            {...props}
          />
          {
            type == "password" &&
            <div className="">
              <div
                className="0 px-3 flex items-center h-full cursor-pointer group-focus-within:hover:bg-input-border"
                onClick={() => setInputType(inputType == "password" ? ("input") : "password")}
              >
                {inputType != "password" ? (
                  <EyeSlash size={20} className="" />
                ) : (
                  <Eye size={20} />
                )}
              </div>
            </div>
          }
          {
            (Object.keys(props.option || {}).length || 0) > 0 &&
            <SelectRoot onValueChange={props.onOptionChange} {...props.optionValue ? { value: props.optionValue } : {}}>
              <SelectTrigger className="w-[40%] border-none bg-transparent rounded-l-none">
                <SelectValue placeholder={props.optionLabel || ""} />
              </SelectTrigger>
              <SelectContent position={optionPosition || "popper"}>
                <SelectGroup>
                  {
                    props.optionName &&
                    <SelectLabel dontShowCheck>{props.optionName}</SelectLabel>
                  }
                  {
                    Object.keys(props.option || {}).map((o, k) => {
                      return <SelectItem key={k} value={o} dontShowCheck>{props.option?.[o]}</SelectItem>
                    })
                  }
                </SelectGroup>
              </SelectContent>
            </SelectRoot>
          }
        </div >

        {
          <AnimatePresence>
            {
              error && (
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
              )
            }
          </AnimatePresence >
        }
      </>
    );
  }
);
Input.displayName = "Input";



export { Input };
