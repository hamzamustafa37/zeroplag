"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: "sm" | "md" | "lg";
  state?: "default" | "error" | "success";
}

const sizeClasses = {
  sm: "h-7 px-2.5 text-xs",
  md: "h-9 px-3 text-sm",
  lg: "h-11 px-4 text-base",
};

const stateClasses = {
  default: "border-slate-700 focus:border-blue-500",
  error: "border-red-500 focus:border-red-400",
  success: "border-green-500 focus:border-green-400",
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, size = "md", state = "default", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full rounded-lg bg-slate-900 border text-slate-50 placeholder:text-slate-500",
          "transition-colors outline-none focus:ring-2 focus:ring-blue-500/30",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          sizeClasses[size],
          stateClasses[state],
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
