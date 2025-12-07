from .base_agent import BaseAgent
import datetime, re

class FraudDetectionAgent(BaseAgent):
    """Comprehensive Fraud Detection Agent for UPI transactions"""

    def __init__(self, name):
        super().__init__(name)
        self.transaction_history = []

    def perform_task(self, transaction):
        try:
            self.log(f"Analyzing transaction: {transaction.get('id', 'N/A')}")

            fraud_score = 0
            alerts = []

            amount = transaction.get("amount", 0)
            timestamp = self._parse_time(transaction.get("timestamp"))
            location = transaction.get("location", "")
            merchant = transaction.get("merchant", "")
            notes = transaction.get("notes", "")

            # High-value transactions
            if amount > 20000:
                fraud_score += 40
                alerts.append(f"High-value transaction: ₹{amount}")

            # Rapid transactions
            self.transaction_history.append({
                "timestamp": timestamp,
                "amount": amount,
                "merchant": merchant,
                "location": location
            })
            last_3 = self.transaction_history[-3:]
            if len(last_3) == 3:
                times = [t["timestamp"] for t in last_3]
                if max(times) - min(times) < datetime.timedelta(minutes=5):
                    fraud_score += 20
                    alerts.append("Multiple transactions within 5 minutes")

            # Unusual merchants
            unusual_merchants = ["Unknown Merchant", "Random Shop", "Suspicious Store"]
            if merchant in unusual_merchants:
                fraud_score += 20
                alerts.append(f"Unusual merchant: {merchant}")

            # Suspicious location
            suspicious_locations = ["Abroad", "Unknown City"]
            if location in suspicious_locations:
                fraud_score += 20
                alerts.append(f"Suspicious location: {location}")

            # Round-number amounts
            if amount > 5000 and amount % 1000 == 0:
                fraud_score += 10
                alerts.append("Round-number transaction amount")

            # Repeated pattern detection
            if len(self.transaction_history) >= 5:
                last_5 = [t["amount"] for t in self.transaction_history[-5:]]
                if all(a == last_5[0] for a in last_5):
                    fraud_score += 15
                    alerts.append("Repeated identical amounts detected")

            # Notes keyword check
            keywords = ["verify", "urgent", "password", "otp", "click here"]
            for kw in keywords:
                if kw.lower() in notes.lower():
                    fraud_score += 10
                    alerts.append(f"Suspicious keyword in notes: {kw}")

            fraud_score = min(fraud_score, 100)

            if fraud_score <= 30:
                level = "LOW → Safe enough"
                safe = "YES"
            elif fraud_score <= 70:
                level = "MEDIUM → Be careful"
                safe = "NO"
            else:
                level = "HIGH → Very risky"
                safe = "NO"

            return {
                "transaction_id": transaction.get("id", "N/A"),
                "fraud_score": fraud_score,
                "fraud_level": level,
                "alerts": alerts if alerts else ["No issues detected"],
                "safe_to_proceed": safe
            }

        except Exception as e:
            self.log(f"Error analyzing transaction: {e}")
            return {
                "transaction_id": transaction.get("id", "N/A"),
                "fraud_score": 0,
                "fraud_level": "LOW → Safe enough",
                "alerts": ["Fallback safe response due to error"],
                "safe_to_proceed": "YES"
            }

    def _parse_time(self, timestamp_str):
        try:
            return datetime.datetime.fromisoformat(timestamp_str)
        except Exception:
            return datetime.datetime.now()
