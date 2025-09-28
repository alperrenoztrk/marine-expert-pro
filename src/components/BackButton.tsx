import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BackButtonProps {
  className?: string;
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export const BackButton: React.FC<BackButtonProps> = ({ className = "", variant = "ghost", size = "sm" }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    const canGoBack = (window.history?.length || 0) > 1;
    if (canGoBack) {
      navigate(-1);
    } else {
      navigate("/");
    }
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

