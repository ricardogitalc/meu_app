"use client";

import { useToast } from "@/hooks/use-toast";
import { FiCheck, FiAlertCircle } from "react-icons/fi"; // Adicionar import
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        variant,
        action,
        ...props
      }) {
        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex items-center gap-3">
              {variant === "destructive" && (
                <FiAlertCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
              )}
              {variant === "success" && (
                <FiCheck className="h-6 w-6 text-green-600 flex-shrink-0" />
              )}
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
