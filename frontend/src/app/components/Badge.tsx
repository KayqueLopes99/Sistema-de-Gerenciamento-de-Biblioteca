import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "error";
  className?: string;
}

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  const variants = {
    default: "bg-muted text-muted-foreground",
    success: "bg-primary/10 text-primary border border-primary/20",
    warning: "bg-secondary/10 text-secondary border border-secondary/20",
    error: "bg-destructive/10 text-destructive border border-destructive/20",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
