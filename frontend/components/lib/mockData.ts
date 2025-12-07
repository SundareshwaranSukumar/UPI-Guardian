export interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  date: string;
  upiId: string;
  riskLevel: "safe" | "low" | "medium" | "high";
  riskFactors: string[];
  category: string;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  time: string;
  severity: "low" | "medium" | "high";
}

export interface ScamPattern {
  id: string;
  name: string;
  description: string;
  frequency: number;
}

export const mockTransactions: Transaction[] = [
  {
    id: "1",
    merchant: "Amazon Pay",
    amount: 2499,
    date: "2024-01-15T10:30:00",
    upiId: "amazonpay@icici",
    riskLevel: "safe",
    riskFactors: [],
    category: "Shopping",
  },
  {
    id: "2",
    merchant: "Unknown Merchant",
    amount: 15000,
    date: "2024-01-15T09:15:00",
    upiId: "urgent.payment@paytm",
    riskLevel: "high",
    riskFactors: ["Unusual UPI ID pattern", "Large amount", "New payee"],
    category: "Unknown",
  },
  {
    id: "3",
    merchant: "Flipkart",
    amount: 899,
    date: "2024-01-14T18:45:00",
    upiId: "flipkart@axl",
    riskLevel: "safe",
    riskFactors: [],
    category: "Shopping",
  },
  {
    id: "4",
    merchant: "Lottery Winner",
    amount: 50000,
    date: "2024-01-14T14:20:00",
    upiId: "winner2024@oksbi",
    riskLevel: "high",
    riskFactors: ["Lottery scam pattern", "Extremely large amount", "Suspicious merchant name"],
    category: "Unknown",
  },
  {
    id: "5",
    merchant: "Zomato",
    amount: 450,
    date: "2024-01-14T12:00:00",
    upiId: "zomato@hdfcbank",
    riskLevel: "safe",
    riskFactors: [],
    category: "Food",
  },
  {
    id: "6",
    merchant: "KYC Update Required",
    amount: 1,
    date: "2024-01-13T16:30:00",
    upiId: "kyc.verify@ybl",
    riskLevel: "medium",
    riskFactors: ["KYC scam pattern", "Suspicious UPI ID"],
    category: "Unknown",
  },
];

export const mockAlerts: Alert[] = [
  {
    id: "1",
    title: "Suspicious QR Code Detected",
    description: "A QR code you scanned yesterday appears to be linked to known scam patterns.",
    time: "2 hours ago",
    severity: "high",
  },
  {
    id: "2",
    title: "New Scam Pattern Alert",
    description: "We've detected increased activity of fake bank OTP scams in your area.",
    time: "5 hours ago",
    severity: "medium",
  },
  {
    id: "3",
    title: "Weekly Security Summary",
    description: "Your transactions are secure. No suspicious activity detected this week.",
    time: "1 day ago",
    severity: "low",
  },
];

export const mockScamPatterns: ScamPattern[] = [
  {
    id: "1",
    name: "Fake KYC Updates",
    description: "Scammers posing as bank officials requesting KYC verification",
    frequency: 45,
  },
  {
    id: "2",
    name: "Lottery Scams",
    description: "Fake lottery winning notifications asking for processing fees",
    frequency: 32,
  },
  {
    id: "3",
    name: "QR Code Hijacking",
    description: "Malicious QR codes that redirect payments to scammers",
    frequency: 28,
  },
];

export const suspiciousKeywords = [
  "urgent",
  "immediately",
  "lottery",
  "winner",
  "kyc",
  "verify",
  "otp",
  "share",
  "link",
  "click",
  "prize",
  "cashback",
  "refund",
  "pending",
  "blocked",
  "suspend",
  "expire",
  "confirm",
  "account",
  "deactivate",
];

export function analyzeMessage(message: string): {
  score: number;
  suspiciousWords: string[];
  explanation: string;
  recommendation: string;
} {
  const lowerMessage = message.toLowerCase();
  const foundWords = suspiciousKeywords.filter((word) =>
    lowerMessage.includes(word)
  );
  
  const score = Math.max(0, 100 - foundWords.length * 15);
  
  let explanation = "";
  let recommendation = "";
  
  if (score >= 80) {
    explanation = "This message appears to be legitimate with no obvious red flags.";
    recommendation = "You can proceed with caution, but always verify the sender.";
  } else if (score >= 50) {
    explanation = "This message contains some suspicious elements that could indicate a scam attempt.";
    recommendation = "Do not click any links or share personal information. Verify directly with your bank.";
  } else {
    explanation = "This message shows multiple signs of a scam attempt. It uses urgency tactics and suspicious language.";
    recommendation = "Do NOT respond or take any action. Block the sender and report to your bank.";
  }
  
  return { score, suspiciousWords: foundWords, explanation, recommendation };
}

export function analyzeQRCode(): {
  score: number;
  merchant: string;
  upiId: string;
  flags: string[];
  recommendation: string;
} {
  // Simulate random analysis results
  const scenarios = [
    {
      score: 95,
      merchant: "Verified Merchant",
      upiId: "merchant@upi",
      flags: [],
      recommendation: "This QR code appears safe. Proceed with your payment.",
    },
    {
      score: 45,
      merchant: "Unknown",
      upiId: "random123@paytm",
      flags: ["Unverified merchant", "Unusual UPI ID format", "No business registration"],
      recommendation: "This QR code shows warning signs. Verify the merchant before paying.",
    },
    {
      score: 15,
      merchant: "URGENT PAYMENT",
      upiId: "win.lottery@ybl",
      flags: ["Known scam pattern", "Suspicious merchant name", "Blacklisted UPI ID"],
      recommendation: "DANGER: This QR code is linked to known scam activity. Do NOT make any payment.",
    },
  ];
  
  return scenarios[Math.floor(Math.random() * scenarios.length)];
}
