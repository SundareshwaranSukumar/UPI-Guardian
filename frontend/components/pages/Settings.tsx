import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  User,
  Bell,
  Shield,
  Lock,
  HelpCircle,
  ChevronRight,
  Moon,
  Smartphone,
  Users,
  Trash2,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

interface SettingItemProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  onClick?: () => void;
}

function SettingItem({ icon, title, description, action, onClick }: SettingItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 p-4 rounded-xl bg-card border border-border transition-colors",
        onClick && "cursor-pointer hover:bg-muted/50"
      )}
    >
      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{description}</p>
        )}
      </div>
      {action || (onClick && <ChevronRight className="w-5 h-5 text-muted-foreground" />)}
    </div>
  );
}

export default function Settings() {
  const [realTimeAlerts, setRealTimeAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [sensitivity, setSensitivity] = useState([50]);

  // Load and save sensitivity to localStorage
  useEffect(() => {
    const saved = localStorage.getItem("scamSensitivity");
    if (saved) {
      setSensitivity([parseInt(saved, 10)]);
    }
  }, []);

  const handleSensitivityChange = (value: number[]) => {
    setSensitivity(value);
    localStorage.setItem("scamSensitivity", value[0].toString());
  };

  const trustedContacts = [
    { name: "Mom", upiId: "mom@paytm" },
    { name: "Dad", upiId: "dad@oksbi" },
    { name: "Best Friend", upiId: "friend@ybl" },
  ];

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Customize your security preferences
          </p>
        </div>

        {/* Account Section */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Account
          </h2>
          <SettingItem
            icon={<User className="w-5 h-5 text-primary" />}
            title="Profile"
            description="Manage your account details"
            onClick={() => {}}
          />
        </motion.section>

        {/* Security Section */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Security
          </h2>

          <div className="space-y-3">
            <SettingItem
              icon={<Bell className="w-5 h-5 text-primary" />}
              title="Real-time Alerts"
              description="Get notified about suspicious activity"
              action={
                <Switch
                  checked={realTimeAlerts}
                  onCheckedChange={setRealTimeAlerts}
                />
              }
            />

            <div className="bg-card border border-border rounded-xl p-4 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Scam Detection Sensitivity</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Higher = more alerts, fewer missed scams
                  </p>
                </div>
              </div>
              <div className="px-2">
                <Slider
                  value={sensitivity}
                  onValueChange={handleSensitivityChange}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-muted-foreground">0%</span>
                  <span className="text-xs text-safe">30%</span>
                  <span className="text-xs text-warning">70%</span>
                  <span className="text-xs text-muted-foreground">100%</span>
                </div>
                <div className="flex justify-center gap-4 mt-3 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-safe" />
                    <span className={sensitivity[0] <= 30 ? "text-safe font-medium" : "text-muted-foreground"}>
                      Low (0-30%)
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-warning" />
                    <span className={sensitivity[0] > 30 && sensitivity[0] <= 70 ? "text-warning font-medium" : "text-muted-foreground"}>
                      Medium (31-70%)
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-danger" />
                    <span className={sensitivity[0] > 70 ? "text-danger font-medium" : "text-muted-foreground"}>
                      High (71-100%)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <SettingItem
              icon={<Lock className="w-5 h-5 text-primary" />}
              title="Privacy Settings"
              description="Control your data and privacy"
              onClick={() => {}}
            />
          </div>
        </motion.section>

        {/* Trusted Contacts */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Trusted Contacts
            </h2>
            <button className="text-sm text-primary font-medium">+ Add</button>
          </div>

          <div className="bg-card border border-border rounded-xl divide-y divide-border overflow-hidden">
            {trustedContacts.map((contact, index) => (
              <motion.div
                key={contact.upiId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center justify-between p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{contact.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {contact.upiId}
                    </p>
                  </div>
                </div>
                <button className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-danger">
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Preferences */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Preferences
          </h2>

          <div className="space-y-3">
            <SettingItem
              icon={<Moon className="w-5 h-5 text-primary" />}
              title="Dark Mode"
              description="Toggle dark theme"
              action={
                <Switch
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              }
            />

            <SettingItem
              icon={<Smartphone className="w-5 h-5 text-primary" />}
              title="Notification Preferences"
              description="Customize alert settings"
              onClick={() => {}}
            />
          </div>
        </motion.section>

        {/* Support */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-3"
        >
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Support
          </h2>

          <SettingItem
            icon={<HelpCircle className="w-5 h-5 text-primary" />}
            title="Help & FAQ"
            description="Get answers to common questions"
            onClick={() => {}}
          />
        </motion.section>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-6"
        >
          <p className="text-sm text-muted-foreground">UPI Guardian v1.0.0</p>
          <p className="text-xs text-muted-foreground mt-1">
            Protecting your digital payments
          </p>
        </motion.div>
      </div>
    </PageContainer>
  );
}
