import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";

const button = cva(
  "inline-flex whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary items-center justify-center w-full text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        active:
          "bg-transparant items-center justify-left gap-2 px-3  w-full text-active-foreground hover:bg-active hover:shadow",
        compose:
          "items-center justify-left gap-2 px-3  w-full text-active-foreground bg-active shadow",
        Navlink:
          "w-full gap-2 px-3 items-center justify-left hover:bg-[rgba(0,0,0,0.06)]",
      },
      active: {
        true: "bg-[rgba(0,0,0,0.06)]",
      },
      size: {
        default: "h-10   py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-xl",
        icon: "h-10 w-10",
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
      >
        {props.children}
      </NavLink>
    );
  }

  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(button({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button, button };
