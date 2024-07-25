import * as React from "react"

import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <>
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md bg-input !outline-none px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50  border focus:!border-input-border !border-transparent",
            className
          )}
          ref={ref}
          {...props}
        />
        {
          <AnimatePresence>
            {
              error &&
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0
                }}
                animate={{
                  opacity: 1,
                  height: "auto"
                }}
                exit={{
                  opacity: 0,
                  height: 0
                }}
                transition={{ease: "easeOut", duration: .3}}
              >
                <motion.span

                  className="text-red-500 text-sm block mt-1">{error}</motion.span>
              </motion.div>
            }
          </AnimatePresence>
        }
      </>
    )
  }
)
Input.displayName = "Input"

export { Input }
