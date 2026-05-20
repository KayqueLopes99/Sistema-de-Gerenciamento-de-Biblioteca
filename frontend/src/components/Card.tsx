import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div
      className={`bg-card rounded-xl shadow-md border border-border p-6 ${
        hover ? "transition-all hover:shadow-lg hover:-translate-y-1" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
