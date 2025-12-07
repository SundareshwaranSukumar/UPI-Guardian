import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, AlertTriangle, CheckCircle, XCircle, RotateCcw, Sparkles } from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { ScoreIndicator } from "@/components/ui/ScoreIndicator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { analyzeMessage } from "@/lib/mockData";

interface AnalysisResult {
  score: number;
  suspiciousWords: string[];
  explanation: string;
  recommendation: string;
}

export default function MessageAnalyzer() {
  const [message, setMessage] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = () => {
    if (!message.trim()) return;

    setIsAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      setResult(analyzeMessage(message));
      setIsAnalyzing(false);
    }, 1500);
  };

  const resetAnalyzer = () => {
    setMessage("");
    setResult(null);
  };

  const highlightSuspiciousWords = (text: string, words: string[]): React.ReactNode => {
    if (words.length === 0) return text;

    const regex = new RegExp(`(${words.join("|")})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      words.some((word) => word.toLowerCase() === part.toLowerCase()) ? (
        <span
          key={index}
          className="bg-warning/30 text-warning-foreground px-1 rounded font-medium"
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Message Analyzer</h1>
          <p className="text-muted-foreground">
            Paste an SMS or WhatsApp message to check for scams
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!result && (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {/* Message Input */}
              <div className="relative">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Paste the suspicious message here...&#10;&#10;Example: 'Dear customer, your account will be blocked. Click here to verify KYC immediately.'"
                  className="min-h-[200px] resize-none text-base"
                  disabled={isAnalyzing}
                />
                <div className="absolute bottom-3 right-3">
                  <span className="text-xs text-muted-foreground">
                    {message.length} characters
                  </span>
                </div>
              </div>

              {/* Sample Messages */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Try a sample:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Your UPI account is blocked. Share OTP to unblock.",
                    "Congratulations! You won ₹50,000. Click link to claim.",
                    "Your Flipkart order has been shipped.",
                  ].map((sample, index) => (
                    <button
                      key={index}
                      onClick={() => setMessage(sample)}
                      className="text-xs bg-muted hover:bg-muted/80 px-3 py-1.5 rounded-full transition-colors"
                    >
                      {sample.slice(0, 30)}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Analyze Button */}
              <Button
                className="w-full h-12 gradient-primary hover:opacity-90"
                onClick={handleAnalyze}
                disabled={!message.trim() || isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full mr-2"
                    />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Analyze Message
                  </>
                )}
              </Button>
            </motion.div>
          )}

          {result && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Score */}
              <div className="flex justify-center">
                <ScoreIndicator score={result.score} label="Safety Score" size="lg" />
              </div>

              {/* Analyzed Message */}
              <div className="bg-card rounded-xl border border-border p-5 space-y-4">
                <div>
                  <span className="text-sm font-medium text-muted-foreground mb-2 block">
                    Analyzed Message
                  </span>
                  <p className="text-sm leading-relaxed bg-muted/50 rounded-lg p-4">
                    {highlightSuspiciousWords(message, result.suspiciousWords)}
                  </p>
                </div>

                {/* Suspicious Words */}
                {result.suspiciousWords.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Suspicious Words Detected
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {result.suspiciousWords.map((word, index) => (
                        <motion.span
                          key={word}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="inline-flex items-center gap-1 bg-warning/10 text-warning px-2 py-1 rounded-full text-sm"
                        >
                          <AlertTriangle className="w-3 h-3" />
                          {word}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Explanation */}
                <div className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Analysis
                  </span>
                  <p className="text-sm text-foreground">{result.explanation}</p>
                </div>

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
                      <p className="font-medium text-sm mb-1">What You Should Do</p>
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
                onClick={resetAnalyzer}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Analyze Another Message
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageContainer>
  );
}
