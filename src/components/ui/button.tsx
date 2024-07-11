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
        link: "text-core text-xs underline-offset-4 hover:underline",
        active:
          "bg-transparant items-center justify-left gap-2 px-3  w-full text-active-foreground hover:bg-active hover:shadow",
        superActive:
          "items-center justify-center w-full py-3 bg-core hover:bg-core-lite shadow text-base !text-[#fff]",
        navlink:
          "group w-full gap-2 px-3 items-center text-normal justify-between hover:bg-sidebar-navlink active:bg-sidebar-navlink-active text-base",
        toolbutton:"w-fit px-2 flex items-center hover:bg-[rgba(0,0,0,0.06)] dark:hover:bg-[rgba(250,250,250,0.19)]",
        star:"hover:text-yellow-500",
        whiteButton:"bg-white items-center justify-center w-full text-primary shadow hover:bg-[rgba(250,250,250,0.95)] dark:bg-[rgba(250,250,250,0.1)]",
        
      },
      active: { 
        true: "is-active bg-sidebar-navlink font-semibold text-base-active",
      },
      size: {
        default: "h-9 rounded-md py-2",
        superActive:"py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-xl",
        icon: "h-10 w-10",
        toolsize:"py-1"
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
      className={cn(button({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

export { Button, button };
