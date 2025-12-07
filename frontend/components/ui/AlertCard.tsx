import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { AlertTriangle, Clock } from "lucide-react";

interface AlertCardProps {
  title: string;
  description: string;
  time: string;
  severity: "low" | "medium" | "high";
  className?: string;
}

const severityStyles = {
  low: "border-l-safe",
  medium: "border-l-warning",
  high: "border-l-danger",
};

export function AlertCard({
  title,
  description,
  time,
  severity,
  className,
}: AlertCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 4 }}
      className={cn(
        "bg-card rounded-lg border border-border border-l-4 p-4 cursor-pointer transition-shadow hover:shadow-md",
        severityStyles[severity],
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
            severity === "high" && "bg-danger/10 text-danger",
            severity === "medium" && "bg-warning/10 text-warning",
            severity === "low" && "bg-safe/10 text-safe"
          )}
        >
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm truncate">{title}</h4>
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {description}
          </p>
          <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{time}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
