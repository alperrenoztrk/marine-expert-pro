import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type InputErrorProps = {
  message?: string | null;
  className?: string;
};

export const InputError = ({ message, className }: InputErrorProps) => {
  if (!message) return null;

  return (
    <div className={cn("mt-1 flex items-start gap-2 text-xs text-red-600 dark:text-red-400", className)}>
      <AlertCircle className="mt-0.5 h-3.5 w-3.5" />
      <span>{message}</span>
    </div>
  );
};
