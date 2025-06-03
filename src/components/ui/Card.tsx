import { type ReactNode } from "react";

interface CardProps {
  className?: string;
  children: ReactNode;
}

export function Card({ className = "", children }: CardProps) {
  return <div className={`rounded-2xl shadow-md ${className}`}>{children}</div>;
}

export function CardContent({ className = "", children }: CardProps) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}
