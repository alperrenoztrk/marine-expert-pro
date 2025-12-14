import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  className?: string;
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  to?: string; // Optional explicit destination
  replace?: boolean; // Whether to replace history entry when using `to`
  fallbackTo?: string; // When history is not available
  label?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({
  className,
  variant = "ghost",
  size = "sm",
  to,
  replace = false,
  fallbackTo = "/",
  label = "Geri Dön",
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to) {
      navigate(to, { replace });
      return;
    }
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate(fallbackTo, { replace: true });
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn("gap-2", className)}
      onClick={handleBack}
    >
      <ArrowLeft className="h-4 w-4" />
      {size !== "icon" ? label : null}
    </Button>
  );
};

export default BackButton;

