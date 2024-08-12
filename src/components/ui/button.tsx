import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";
import { Spinner } from "../Spinner";

const button = cva(
  "inline-flex whitespace-nowrap rounded-md px-5 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "items-center justify-center w-full bg-core hover:bg-core-lite active:bg-core shadow !text-[#fff]",
        secondary:
          "w-full gap-2 justify-center items-center bg-button hover:bg-button-hover dark:hover:bg-button-hover  dark:active:bg-button-active  active:bg-button-active border border-button-border dark:border-none",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-core text-xs underline-offset-4 hover:underline",
        active:
          "bg-transparant items-center justify-left gap-2 px-3  w-full text-active-foreground hover:bg-active hover:shadow",
        navlink:
          "group w-full gap-2 px-3 items-center text-normal justify-between hover:bg-button dark:hover:bg-button-hover active:!bg-button-active",
        toolbutton: "w-fit !py-2 !px-2 items-center hover:bg-button-hover active:bg-button-active",
        star: "hover:text-yellow-500",
        whiteButton: "bg-white items-center justify-center w-full text-primary shadow-md hover:bg-[rgba(250,250,250,0.95)] dark:bg-[rgba(250,250,250,0.1)]",
      },
      active: {
        true: "is-active bg-button dark:bg-button-hover dark:active:bg-button-active !font-[500]",
      },
      size: {
        default: "h-9 rounded-md !py-2 h-[38px]",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-xl",
        icon: "h-10 w-10",
        toolsize: "py-1"
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof button> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & { to?: string }
>(({ className, variant, size, asChild = false, children, ...props }, ref) => {
  if (props.to) {
    return (
      <NavLink
        className={({ isActive }) => {
          return cn(button({ variant, size, className, active: isActive }));
        }}
        to={props.to}
        end
      >
        {children}
      </NavLink>
    );
  }

  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(button({ variant, size, className, active: props.active }))}
      ref={ref}
      {...props}
      disabled={props.loading}
    >
      {props.loading && (
        <Spinner size={16} className="mr-2 !border-t-white"/>
      )}
      {children}
    </Comp>
  );
});
Button.displayName = "Button";

export { Button, button };
