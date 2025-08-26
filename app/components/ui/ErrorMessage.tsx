"use client";

import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export function ErrorMessage({ message, className = "" }: ErrorMessageProps) {
  if (!message) return null;
  
  return (
    <div className={`flex items-center gap-xs bg-error/10 text-error rounded-md px-sm py-xs text-sm ${className}`} role="alert">
      <AlertCircle className="w-4 h-4 flex-shrink-0" />
      <p>{message}</p>
    </div>
  );
}

