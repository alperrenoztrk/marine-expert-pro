import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  className?: string;
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  to?: string; // Optional explicit destination
  replace?: boolean; // Whether to replace history entry when using `to`
}

export const BackButton: React.FC<BackButtonProps> = ({ className = "", variant = "ghost", size = "sm", to, replace = false }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (to) {
      navigate(to, { replace });
      return;
    }
    const canGoBack = (window.history?.length || 0) > 1;
    if (canGoBack) navigate(-1);
    else navigate("/");
  };

  return (
    <Button onClick={handleBack} variant={variant} size={size} className={`gap-2 ${className}`}>
      <ArrowLeft className="w-4 h-4" />
      <span className="hidden xs:inline" data-translatable>Geri</span>
      <span className="xs:hidden" data-translatable>Geri</span>
    </Button>
  );
};

export default BackButton;

