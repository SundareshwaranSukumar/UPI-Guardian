import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";

interface SensitivityGaugeProps {
  value: number;
  className?: string;
}

function getRiskLabel(value: number): { label: string; color: string } {
  if (value <= 30) return { label: "Low Risk", color: "text-safe" };
  if (value <= 60) return { label: "Medium Risk", color: "text-warning" };
  return { label: "High Risk", color: "text-danger" };
}

export function SensitivityGauge({ value, className }: SensitivityGaugeProps) {
  const risk = getRiskLabel(value);
  const percentage = Math.min(100, Math.max(0, value));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "bg-card rounded-xl border border-border p-5",
        className
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Detection Sensitivity</p>
          <p className={cn("text-lg font-bold", risk.color)}>{risk.label}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-2xl font-bold">{value}%</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full",
            value <= 30 && "bg-safe",
            value > 30 && value <= 60 && "bg-warning",
            value > 60 && "bg-danger"
          )}
        />
      </div>

      {/* Scale Labels */}
      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
        <span>0% Low</span>
        <span>30%</span>
        <span>60%</span>
        <span>100% High</span>
      </div>
    </motion.div>
  );
}
