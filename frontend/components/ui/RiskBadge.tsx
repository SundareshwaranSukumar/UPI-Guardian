import { cn } from "@/lib/utils";
import { Shield, AlertTriangle, ShieldAlert } from "lucide-react";

type RiskLevel = "safe" | "low" | "medium" | "high";

interface RiskBadgeProps {
  level: RiskLevel;
  showIcon?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const riskConfig = {
  safe: {
    label: "Safe",
    icon: Shield,
    className: "bg-safe/10 text-safe border-safe/20",
  },
  low: {
    label: "Low Risk",
    icon: Shield,
    className: "bg-safe/10 text-safe border-safe/20",
  },
  medium: {
    label: "Warning",
    icon: AlertTriangle,
    className: "bg-warning/10 text-warning border-warning/20",
  },
  high: {
    label: "High Risk",
    icon: ShieldAlert,
    className: "bg-danger/10 text-danger border-danger/20",
  },
};

const sizeClasses = {
  sm: "text-xs px-2 py-0.5 gap-1",
  md: "text-sm px-3 py-1 gap-1.5",
  lg: "text-base px-4 py-1.5 gap-2",
};

const iconSizes = {
  sm: 12,
  md: 14,
  lg: 16,
};

export function RiskBadge({
  level,
  showIcon = true,
  size = "md",
  className,
}: RiskBadgeProps) {
  const config = riskConfig[level];
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full border",
        config.className,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <Icon size={iconSizes[size]} />}
      {config.label}
    </span>
  );
}
