import React from "react";

interface BackButtonProps {
  className?: string;
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  to?: string; // Optional explicit destination
  replace?: boolean; // Whether to replace history entry when using `to`
}

export const BackButton: React.FC<BackButtonProps> = () => {
  return null;
};

export default BackButton;

