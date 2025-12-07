import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ScoreIndicatorProps {
  score: number;
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeConfig = {
  sm: { diameter: 80, strokeWidth: 6, fontSize: "text-lg" },
  md: { diameter: 120, strokeWidth: 8, fontSize: "text-2xl" },
  lg: { diameter: 160, strokeWidth: 10, fontSize: "text-3xl" },
};

function getScoreColor(score: number): string {
  if (score >= 80) return "hsl(var(--safe))";
  if (score >= 50) return "hsl(var(--warning))";
  return "hsl(var(--danger))";
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Safe";
  if (score >= 50) return "Caution";
  return "Risky";
}

export function ScoreIndicator({
  score,
  label,
  size = "md",
  className,
}: ScoreIndicatorProps) {
  const config = sizeConfig[size];
  const radius = (config.diameter - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = ((100 - score) / 100) * circumference;
  const color = getScoreColor(score);

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="relative" style={{ width: config.diameter, height: config.diameter }}>
        <svg
          width={config.diameter}
          height={config.diameter}
          className="transform -rotate-90"
        >
          <circle
            cx={config.diameter / 2}
            cy={config.diameter / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={config.strokeWidth}
          />
          <motion.circle
            cx={config.diameter / 2}
            cy={config.diameter / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={config.strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: progress }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={cn("font-bold", config.fontSize)}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {score}
          </motion.span>
          <span className="text-xs text-muted-foreground">{getScoreLabel(score)}</span>
        </div>
      </div>
      {label && (
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      )}
    </div>
  );
}
