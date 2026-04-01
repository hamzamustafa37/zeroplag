"use client";

import * as RadixTooltip from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  className?: string;
  delayDuration?: number;
}

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return (
    <RadixTooltip.Provider delayDuration={200}>
      {children}
    </RadixTooltip.Provider>
  );
}

export function Tooltip({
  content,
  children,
  side = "top",
  className,
  delayDuration = 200,
}: TooltipProps) {
  return (
    <RadixTooltip.Root delayDuration={delayDuration}>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <RadixTooltip.Portal>
        <RadixTooltip.Content
          side={side}
          sideOffset={12}
          className={cn(
            "z-50 rounded-lg bg-slate-700 border border-slate-600 px-3 py-2",
            "text-xs text-slate-100 shadow-xl max-w-xs",
            "animate-in fade-in-0 zoom-in-95 duration-150",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            className
          )}
        >
          {content}
          <RadixTooltip.Arrow className="fill-slate-700" />
        </RadixTooltip.Content>
      </RadixTooltip.Portal>
    </RadixTooltip.Root>
  );
}
