import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-slate-800 border border-slate-700 overflow-hidden",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: CardProps) {
  return (
    <div
      className={cn("px-4 py-3 border-b border-slate-700 flex items-center gap-3", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: CardProps) {
  return <div className={cn("p-4", className)} {...props} />;
}

export function CardFooter({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "px-4 py-3 border-t border-slate-700 flex items-center gap-2",
        className
      )}
      {...props}
    />
  );
}
