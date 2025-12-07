import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Shield, ShieldAlert, AlertTriangle } from "lucide-react";

type StatusType = "safe" | "warning" | "danger";

interface SafetyStatusProps {
  status: StatusType;
  message: string;
  className?: string;
}

const statusConfig = {
  safe: {
    icon: Shield,
    gradient: "gradient-safe",
    label: "All Clear",
    bgClass: "bg-safe/5",
    borderClass: "border-safe/20",
  },
  warning: {
    icon: AlertTriangle,
    gradient: "gradient-warning",
    label: "Caution",
    bgClass: "bg-warning/5",
    borderClass: "border-warning/20",
  },
  danger: {
    icon: ShieldAlert,
    gradient: "gradient-danger",
    label: "Alert",
    bgClass: "bg-danger/5",
    borderClass: "border-danger/20",
  },
};

export function SafetyStatus({ status, message, className }: SafetyStatusProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "rounded-2xl border p-6",
        config.bgClass,
        config.borderClass,
        className
      )}
    >
      <div className="flex items-center gap-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.1 }}
          className={cn(
            "w-14 h-14 rounded-xl flex items-center justify-center",
            config.gradient
          )}
        >
          <Icon className="w-7 h-7 text-primary-foreground" />
        </motion.div>

        <div className="flex-1">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Security Status
          </span>
          <h3 className="text-xl font-bold mt-0.5">{config.label}</h3>
          <p className="text-sm text-muted-foreground mt-1">{message}</p>
        </div>
      </div>
    </motion.div>
  );
}
