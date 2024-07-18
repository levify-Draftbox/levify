import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";

const button = cva(
  "inline-flex whitespace-nowrap rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-core items-center justify-center w-full text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "w-full gap-2 px-3 justify-center items-center bg-button hover:bg-button-hover dark:hover:bg-button-active active:bg-button-active border border-button-border dark:border-none",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-core text-xs underline-offset-4 hover:underline",
        active:
          "bg-transparant items-center justify-left gap-2 px-3  w-full text-active-foreground hover:bg-active hover:shadow",
        superActive:
          "items-center justify-center w-full !py-2 bg-core hover:bg-core-lite active:bg-core  shadow  !text-[#fff]",
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
        default: "h-9 rounded-md py-2",
        superActive: "py-2",
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
}

const Button = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & { to?: string }
>(({ className, variant, size, asChild = false, ...props }, ref) => {
  if (props.to) {
    return (
      <NavLink
        // className={cn(button({ variant, size, className, active:true }))}
        className={({ isActive }) => {
          return cn(button({ variant, size, className, active: isActive }));
        }}
        to={props.to}
        end
      >
        {props.children}
      </NavLink>
    );
  }

  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(button({ variant, size, className, active: props.active }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button, button };
