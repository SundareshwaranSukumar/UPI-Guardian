import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface GaugeMeterProps {
  value: number;
  className?: string;
}

function getRiskInfo(value: number): { label: string; color: string; bgColor: string } {
  if (value <= 30) return { label: "Low Risk", color: "hsl(var(--safe))", bgColor: "bg-safe/10" };
  if (value <= 70) return { label: "Medium Risk", color: "hsl(var(--warning))", bgColor: "bg-warning/10" };
  return { label: "High Risk", color: "hsl(var(--danger))", bgColor: "bg-danger/10" };
}

export function GaugeMeter({ value, className }: GaugeMeterProps) {
  const risk = getRiskInfo(value);
  const percentage = Math.min(100, Math.max(0, value));
  
  // Calculate rotation for needle (-90 to 90 degrees, representing 0-100%)
  const rotation = -90 + (percentage / 100) * 180;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "bg-card rounded-xl border border-border p-5",
        className
      )}
    >
      <p className="text-sm font-medium text-muted-foreground text-center mb-4">
        Scam Detection Sensitivity
      </p>

      {/* Gauge Container */}
      <div className="relative w-48 h-28 mx-auto">
        {/* Gauge Background Arc */}
        <svg
          viewBox="0 0 200 110"
          className="w-full h-full"
        >
          {/* Background arc segments */}
          <defs>
            <linearGradient id="lowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--safe))" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(var(--safe))" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="mediumGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--warning))" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(var(--warning))" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="highGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--danger))" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(var(--danger))" stopOpacity="0.5" />
            </linearGradient>
          </defs>

          {/* Low risk arc (0-30%) */}
          <path
            d="M 20 100 A 80 80 0 0 1 56 32"
            fill="none"
            stroke="hsl(var(--safe))"
            strokeWidth="12"
            strokeLinecap="round"
            opacity="0.3"
          />
          
          {/* Medium risk arc (31-70%) */}
          <path
            d="M 60 28 A 80 80 0 0 1 140 28"
            fill="none"
            stroke="hsl(var(--warning))"
            strokeWidth="12"
            strokeLinecap="round"
            opacity="0.3"
          />
          
          {/* High risk arc (71-100%) */}
          <path
            d="M 144 32 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="hsl(var(--danger))"
            strokeWidth="12"
            strokeLinecap="round"
            opacity="0.3"
          />

          {/* Active arc */}
          <motion.path
            d="M 20 100 A 80 80 0 0 1 56 32"
            fill="none"
            stroke={value <= 30 ? "hsl(var(--safe))" : "transparent"}
            strokeWidth="12"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: value <= 30 ? value / 30 : 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          />

          {/* Tick marks */}
          {[0, 30, 70, 100].map((tick, i) => {
            const angle = -90 + (tick / 100) * 180;
            const rad = (angle * Math.PI) / 180;
            const x1 = 100 + 65 * Math.cos(rad);
            const y1 = 100 + 65 * Math.sin(rad);
            const x2 = 100 + 75 * Math.cos(rad);
            const y2 = 100 + 75 * Math.sin(rad);
            return (
              <line
                key={tick}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="hsl(var(--muted-foreground))"
                strokeWidth="2"
                opacity="0.5"
              />
            );
          })}
        </svg>

        {/* Needle */}
        <motion.div
          className="absolute bottom-0 left-1/2 origin-bottom"
          style={{ width: 4, height: 60, marginLeft: -2 }}
          initial={{ rotate: -90 }}
          animate={{ rotate: rotation }}
          transition={{ duration: 1, type: "spring", stiffness: 60 }}
        >
          <div 
            className="w-full h-full rounded-full"
            style={{ background: risk.color }}
          />
        </motion.div>

        {/* Center circle */}
        <div 
          className="absolute bottom-0 left-1/2 w-4 h-4 -ml-2 -mb-2 rounded-full border-2 border-card"
          style={{ background: risk.color }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-2 px-2 text-xs text-muted-foreground">
        <span>0%</span>
        <span>30%</span>
        <span>70%</span>
        <span>100%</span>
      </div>

      {/* Value and Risk Label */}
      <div className="text-center mt-4">
        <motion.p
          key={value}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-3xl font-bold"
        >
          {value}%
        </motion.p>
        <p 
          className={cn(
            "text-sm font-semibold mt-1",
            value <= 30 && "text-safe",
            value > 30 && value <= 70 && "text-warning",
            value > 70 && "text-danger"
          )}
        >
          {risk.label}
        </p>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 mt-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-safe" />
          <span className="text-muted-foreground">0-30%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-warning" />
          <span className="text-muted-foreground">31-70%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-danger" />
          <span className="text-muted-foreground">71-100%</span>
        </div>
      </div>
    </motion.div>
  );
}
