import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { QrCode, MessageSquare, ShieldCheck, Users, TrendingUp } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { SafetyStatus } from "@/components/ui/SafetyStatus";
import { QuickActionCard } from "@/components/ui/QuickActionCard";
import { AlertCard } from "@/components/ui/AlertCard";
import { GaugeMeter } from "@/components/ui/GaugeMeter";
import { mockAlerts, mockScamPatterns } from "@/lib/mockData";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Index() {
  const [sensitivity, setSensitivity] = useState(50);

  // Load sensitivity from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("scamSensitivity");
    if (saved) {
      setSensitivity(parseInt(saved, 10));
    }
  }, []);

  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";

  return (
    <PageContainer>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold">{greeting}!</h1>
          <p className="text-muted-foreground">
            Your UPI transactions are protected by Guardian
          </p>
        </motion.div>

        {/* Safety Status */}
        <motion.div variants={itemVariants}>
          <SafetyStatus
            status="safe"
            message="No suspicious activity detected in the last 24 hours"
          />
        </motion.div>

        {/* Gauge Meter */}
        <motion.div variants={itemVariants}>
          <GaugeMeter value={sensitivity} />
        </motion.div>

        {/* Quick Actions */}
        <motion.section variants={itemVariants} className="space-y-4">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <QuickActionCard
              to="/qr-scanner"
              icon={QrCode}
              title="Scan QR"
              description="Check QR code safety"
              variant="primary"
            />
            <QuickActionCard
              to="/message-analyzer"
              icon={MessageSquare}
              title="Analyze Message"
              description="Check SMS for scams"
            />
          </div>
        </motion.section>

        {/* Recent Alerts */}
        <motion.section variants={itemVariants} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Alerts</h2>
            <span className="text-sm text-primary font-medium cursor-pointer hover:underline">
              View all
            </span>
          </div>
          <div className="space-y-3">
            {mockAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <AlertCard {...alert} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Scam Patterns & Stats */}
        <motion.section variants={itemVariants} className="space-y-4">
          <h2 className="text-lg font-semibold">Trending Scam Patterns</h2>
          <div className="grid gap-3">
            {mockScamPatterns.map((pattern, index) => (
              <motion.div
                key={pattern.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-card rounded-xl border border-border p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{pattern.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {pattern.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-warning">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-bold">{pattern.frequency}%</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Quick Stats */}
        <motion.section variants={itemVariants}>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-safe/10 flex items-center justify-center mx-auto mb-2">
                <ShieldCheck className="w-5 h-5 text-safe" />
              </div>
              <p className="text-2xl font-bold">12</p>
              <p className="text-xs text-muted-foreground">Scans Today</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-5 h-5 text-warning" />
              </div>
              <p className="text-2xl font-bold">3</p>
              <p className="text-xs text-muted-foreground">Threats Blocked</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <p className="text-2xl font-bold">8</p>
              <p className="text-xs text-muted-foreground">Trusted Payees</p>
            </div>
          </div>
        </motion.section>
      </motion.div>
    </PageContainer>
  );
}
