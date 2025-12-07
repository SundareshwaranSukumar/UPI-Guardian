import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface QuickActionCardProps {
  to: string;
  icon: LucideIcon;
  title: string;
  description: string;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
}

const variantStyles = {
  primary: "gradient-primary text-primary-foreground",
  secondary: "bg-card border border-border hover:border-primary/30",
  outline: "bg-transparent border-2 border-dashed border-border hover:border-primary/50",
};

export function QuickActionCard({
  to,
  icon: Icon,
  title,
  description,
  variant = "secondary",
  className,
}: QuickActionCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        to={to}
        className={cn(
          "block rounded-xl p-5 transition-all duration-300",
          "shadow-sm hover:shadow-md",
          variantStyles[variant],
          className
        )}
      >
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center mb-3",
            variant === "primary" 
              ? "bg-primary-foreground/20" 
              : "bg-primary/10"
          )}
        >
          <Icon
            className={cn(
              "w-5 h-5",
              variant === "primary" ? "text-primary-foreground" : "text-primary"
            )}
          />
        </div>
        <h3
          className={cn(
            "font-semibold text-base",
            variant !== "primary" && "text-foreground"
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "text-sm mt-1",
            variant === "primary"
              ? "text-primary-foreground/80"
              : "text-muted-foreground"
          )}
        >
          {description}
        </p>
      </Link>
    </motion.div>
  );
}
