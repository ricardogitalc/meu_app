"use client";

import { useToast } from "@/hooks/use-toast";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
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
            <div className="flex justify-center items-center gap-3">
              {variant === "destructive" && (
                <FiXCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              )}
              {variant === "success" && (
                <FiCheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
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
