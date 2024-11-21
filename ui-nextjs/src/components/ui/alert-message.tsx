import { FiCheckCircle, FiAlertCircle, FiInfo } from "react-icons/fi";

interface AlertMessageProps {
  message?: string | null;
  type: "success" | "error";
  variant?: "default" | "subtle";
}

export function AlertMessage({
  message,
  type,
  variant = "default",
}: AlertMessageProps) {
  if (!message) return null;

  const icons = {
    success: <FiCheckCircle className="w-4 h-4" />,
    error: <FiAlertCircle className="w-4 h-4" />,
  };

  const styles = {
    default: {
      success:
        "bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400 border-green-200 dark:border-green-900",
      error:
        "bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900",
    },
    subtle: {
      success: "text-green-600 dark:text-green-400",
      error: "text-red-600 dark:text-red-400",
    },
  };

  const baseClass =
    variant === "default"
      ? "flex items-center gap-2 p-3 border rounded-md"
      : "flex items-center gap-2 text-sm";

  return (
    <div className={`${baseClass} ${styles[variant][type]}`}>
      {variant === "default" && icons[type]}
      <span className="text-sm">{message}</span>
    </div>
  );
}
