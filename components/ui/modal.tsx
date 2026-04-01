"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  className,
}: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        {/* Backdrop */}
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-in fade-in-0 duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />

        {/* Panel */}
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
            "w-full max-w-lg rounded-xl bg-slate-800 border border-slate-700 shadow-2xl",
            "animate-in fade-in-0 zoom-in-95 duration-200",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "focus:outline-none p-6",
            className
          )}
        >
          {title && (
            <Dialog.Title className="text-lg font-semibold text-slate-50 mb-1">
              {title}
            </Dialog.Title>
          )}
          {description && (
            <Dialog.Description className="text-sm text-slate-400 mb-4">
              {description}
            </Dialog.Description>
          )}

          {children}

          <Dialog.Close
            aria-label="Close"
            className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:text-slate-50 hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
