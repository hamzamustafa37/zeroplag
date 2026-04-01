"use client";

import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
  loading?: boolean;
}

const variantClasses = {
  primary:
    "bg-blue-600 hover:bg-blue-500 text-white border-transparent",
  secondary:
    "bg-slate-700 hover:bg-slate-600 text-slate-50 border-slate-600",
  ghost:
    "bg-transparent hover:bg-slate-800 text-slate-300 hover:text-slate-50 border-transparent",
  danger:
    "bg-red-700 hover:bg-red-600 text-white border-transparent",
};

const sizeClasses = {
  sm: "h-7 px-3 text-xs gap-1.5",
  md: "h-9 px-4 text-sm gap-2",
  lg: "h-11 px-6 text-base gap-2.5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      asChild = false,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";
    const classes = cn(
      "inline-flex items-center justify-center rounded-lg border font-medium",
      "transition-colors focus-visible:outline-none focus-visible:ring-2",
      "focus-visible:ring-blue-500 focus-visible:ring-offset-2",
      "focus-visible:ring-offset-slate-900 disabled:opacity-50",
      "disabled:cursor-not-allowed select-none",
      variantClasses[variant],
      sizeClasses[size],
      className
    );

    // Slot (asChild) requires exactly one child — skip spinner
    if (asChild) {
      return (
        <Comp ref={ref} className={classes} {...props}>
          {children}
        </Comp>
      );
    }

    return (
      <Comp
        ref={ref}
        disabled={disabled || loading}
        className={classes}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-4 w-4 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </Comp>
    );
  }
);
Button.displayName = "Button";
