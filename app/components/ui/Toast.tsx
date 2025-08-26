"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
}

export function Toast({ 
  message, 
  type = "info", 
  duration = 3000, 
  onClose 
}: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onClose?.();
      }, 300); // Wait for animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-success" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-error" />;
      case "info":
        return <Info className="w-5 h-5 text-accent" />;
      default:
        return null;
    }
  };

  const getToastClasses = () => {
    const baseClasses = "fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-sm bg-surface border rounded-lg shadow-hover py-sm px-md z-50 transition-all duration-300";
    
    const typeClasses = {
      success: "border-success/30",
      error: "border-error/30",
      info: "border-accent/30"
    };
    
    const visibilityClasses = isVisible 
      ? "opacity-100 translate-y-0" 
      : "opacity-0 translate-y-4";
    
    return `${baseClasses} ${typeClasses[type]} ${visibilityClasses}`;
  };

  return (
    <div className={getToastClasses()}>
      {getIcon()}
      <p className="text-sm">{message}</p>
      <button 
        onClick={handleClose}
        className="ml-sm text-muted hover:text-text"
        aria-label="Close toast"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// Toast container to manage multiple toasts
interface ToastContainerProps {
  toasts: Array<{
    id: string;
    message: string;
    type: ToastType;
  }>;
  removeToast: (id: string) => void;
}

export function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </>
  );
}

