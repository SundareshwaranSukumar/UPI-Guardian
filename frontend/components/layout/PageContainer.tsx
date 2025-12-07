import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "min-h-screen pt-14 pb-20 md:pt-20 md:pb-8 px-4",
        className
      )}
    >
      <div className="container max-w-4xl mx-auto">{children}</div>
    </motion.main>
  );
}
