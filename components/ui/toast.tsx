"use client";

import * as RadixToast from "@radix-ui/react-toast";
import { cn } from "@/lib/utils";

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "success" | "error" | "warning";
}

const variantClasses = {
  default: "border-slate-600",
  success: "border-green-600",
  error: "border-red-600",
  warning: "border-amber-600",
};

interface ToastProps extends ToastItem {
  onDismiss: (id: string) => void;
}

export function Toast({ id, title, description, variant = "default", onDismiss }: ToastProps) {
  return (
    <RadixToast.Root
      className={cn(
        "relative flex flex-col gap-1 rounded-xl p-4 pr-10",
        "bg-slate-800 border shadow-xl",
        "data-[state=open]:animate-in data-[state=open]:slide-in-from-right-full",
        "data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right-full",
        "duration-300",
        variantClasses[variant]
      )}
      onOpenChange={(open) => !open && onDismiss(id)}
      duration={5000}
    >
      <RadixToast.Title className="text-sm font-medium text-slate-50">
        {title}
      </RadixToast.Title>
      {description && (
        <RadixToast.Description className="text-xs text-slate-400">
          {description}
        </RadixToast.Description>
      )}
      <RadixToast.Close
        aria-label="Dismiss"
        className="absolute right-3 top-3 rounded p-1 text-slate-400 hover:text-slate-50 transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </RadixToast.Close>
    </RadixToast.Root>
  );
}

export function ToastViewport() {
  return (
    <RadixToast.Viewport className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-80 max-w-full" />
  );
}

export { RadixToast as ToastProvider };
export type { ToastItem };
