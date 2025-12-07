import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Camera, QrCode, AlertTriangle, CheckCircle, XCircle, RotateCcw } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { ScoreIndicator } from "@/components/ui/ScoreIndicator";
import { RiskBadge } from "@/components/ui/RiskBadge";
import { Button } from "@/components/ui/button";
import { analyzeQRCode } from "@/lib/mockData";

interface AnalysisResult {
  score: number;
  merchant: string;
  upiId: string;
  flags: string[];
  recommendation: string;
}

export default function QRScanner() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      analyzeImage();
    }
  };

  const analyzeImage = () => {
    setIsAnalyzing(true);
    setResult(null);

    // Simulate API call
    setTimeout(() => {
      setResult(analyzeQRCode());
      setIsAnalyzing(false);
    }, 2000);
  };

  const resetScanner = () => {
    setResult(null);
    setIsAnalyzing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getRiskLevel = (score: number): "safe" | "medium" | "high" => {
    if (score >= 80) return "safe";
    if (score >= 50) return "medium";
    return "high";
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">QR Code Scanner</h1>
          <p className="text-muted-foreground">
            Scan or upload a QR code to check if it's safe
          </p>
        </div>

        {/* Scanner Area */}
        <AnimatePresence mode="wait">
          {!result && !isAnalyzing && (
            <motion.div
              key="scanner"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4"
            >
              {/* Camera Preview Placeholder */}
              <div className="relative aspect-square max-w-sm mx-auto bg-card rounded-2xl border-2 border-dashed border-border overflow-hidden">
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-4">
                    <Camera className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Position the QR code within the frame
                  </p>
                </div>

                {/* Scanner Frame Corners */}
                <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-primary rounded-br-lg" />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 max-w-sm mx-auto">
                <Button
                  variant="outline"
                  className="flex-1 h-12"
                  onClick={handleUpload}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
                <Button
                  className="flex-1 h-12 gradient-primary hover:opacity-90"
                  onClick={analyzeImage}
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Scan Now
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </motion.div>
          )}

          {isAnalyzing && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-16 space-y-6"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 rounded-full border-4 border-muted border-t-primary"
              />
              <div className="text-center">
                <p className="font-semibold">Analyzing QR Code...</p>
                <p className="text-sm text-muted-foreground">
                  Checking against known scam patterns
                </p>
              </div>
            </motion.div>
          )}

          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Score */}
              <div className="flex justify-center">
                <ScoreIndicator score={result.score} label="Safety Score" size="lg" />
              </div>

              {/* Details Card */}
              <div className="bg-card rounded-xl border border-border p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Risk Level</span>
                  <RiskBadge level={getRiskLevel(result.score)} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 border-b border-border">
                    <span className="text-sm text-muted-foreground">Merchant</span>
                    <span className="font-medium">{result.merchant}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-muted-foreground">UPI ID</span>
                    <span className="font-mono text-sm">{result.upiId}</span>
                  </div>
                </div>

                {/* Flags */}
                {result.flags.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Warning Flags
                    </span>
                    <div className="space-y-2">
                      {result.flags.map((flag, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-2 text-sm text-warning"
                        >
                          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                          <span>{flag}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendation */}
                <div
                  className={`rounded-lg p-4 ${
                    result.score >= 80
                      ? "bg-safe/10 border border-safe/20"
                      : result.score >= 50
                      ? "bg-warning/10 border border-warning/20"
                      : "bg-danger/10 border border-danger/20"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {result.score >= 80 ? (
                      <CheckCircle className="w-5 h-5 text-safe flex-shrink-0 mt-0.5" />
                    ) : result.score >= 50 ? (
                      <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium text-sm mb-1">Recommendation</p>
                      <p className="text-sm text-muted-foreground">
                        {result.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reset Button */}
              <Button
                variant="outline"
                className="w-full h-12"
                onClick={resetScanner}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Scan Another QR Code
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageContainer>
  );
}
