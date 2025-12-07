from .base_agent import BaseAgent
import os, re, json, requests
from urllib.parse import urlparse

class MessageRiskAgent(BaseAgent):
    """Analyzes messages for fraud using Gemini 3, fallback rules, and generic scam detection."""

    def __init__(self, name="MessageRiskAgent"):
        super().__init__(name)
        self.api_key = os.getenv("GEMINI_API_KEY")
        self.endpoint = "https://api.generativeai.google/v1beta2/models/gemini-3.0/generateText"

        # Load RBI registered banks JSON
        banks_path = os.path.join("utils", "rbi_banks.json")
        with open(banks_path, "r") as f:
            self.banks_db = json.load(f)

        # Few-shot examples
        self.examples = """
Examples:

1. Low Risk:
Message: "Your account XXXX1234 has been credited with ₹5,000 on 07-Dec-2025. Thank you for banking with HDFC Bank."
Output: {"risk_score": 10, "risk_level": "LOW → Safe enough", "info": "No suspicious content", "safe_to_proceed": "YES"}

2. Medium Risk:
Message: "Urgent: Verify your account XXXX1234 by clicking http://bank-secure.xyz"
Output: {"risk_score": 60, "risk_level": "MEDIUM → Be careful", "info": "Suspicious link, urgency detected", "safe_to_proceed": "NO"}

3. High Risk:
Message: "Your account XXXX1234 has been debited with ₹50,000. Click here to verify immediately: http://fakebank.link OTP:123456"
Output: {"risk_score": 95, "risk_level": "HIGH → Very risky", "info": "Suspicious link, large amount, OTP included", "safe_to_proceed": "NO"}

4. Generic Scam:
Message: "Congratulations! You won a reward of ₹10,000. Redeem now: http://fake-rewards.link Enter your account and OTP."
Output: {"risk_score": 90, "risk_level": "HIGH → Very risky", "info": "Reward scam, suspicious link, OTP requested", "safe_to_proceed": "NO"}
"""

    # -----------------------------
    # Gemini LLM analysis
    # -----------------------------
    def perform_task(self, text):
        self.log(f"Analyzing message (first 100 chars): {text[:100]}")

        # Build prompt
        prompt = f"""
You are a UPI fraud detection assistant.
Analyze the message below and return JSON output ONLY.
Use these few-shot examples:

{self.examples}

Now analyze the following message(s):
{text}

Return JSON ONLY with keys:
"risk_score" (0-100), "risk_level", "info", "safe_to_proceed"
"""

        headers = {"Authorization": f"Bearer {self.api_key}", "Content-Type": "application/json"}
        payload = {"prompt": prompt, "max_output_tokens": 250}

        try:
            response = requests.post(self.endpoint, headers=headers, json=payload, timeout=10)
            response.raise_for_status()
            llm_text = response.json().get("candidates", [{}])[0].get("output", "")

            try:
                result = json.loads(llm_text)
                result.setdefault("risk_score", 0)
                result.setdefault("risk_level", "LOW → Safe enough")
                result.setdefault("info", "No issues detected")
                result.setdefault("safe_to_proceed", "YES")
                return result
            except json.JSONDecodeError:
                self.log("Failed to parse Gemini output. Using fallback rules.")
                return self.fallback_analysis(text)

        except Exception as e:
            self.log(f"Gemini API failed: {e}. Using fallback.")
            return self.fallback_analysis(text)

    # -----------------------------
    # Fallback analysis
    # -----------------------------
    def fallback_analysis(self, text):
        risk_score = 0
        info = []

        # -----------------------------
        # 1. Keyword / urgency detection
        # -----------------------------
        keywords = ["click here", "verify", "urgent", "password", "otp", "redeem", "reward", "win", "prize", "congratulations"]
        for kw in keywords:
            if kw.lower() in text.lower():
                risk_score += 15
                info.append(f"Keyword detected: {kw}")

        # -----------------------------
        # 2. Link detection
        # -----------------------------
        links = re.findall(r'http[s]?://\S+', text)
        suspicious_links = []
        for link in links:
            domain = urlparse(link).netloc
            # check if matches any RBI bank URL
            valid = any(urlparse(bank['url']).netloc in domain for bank in self.banks_db.values())
            if not valid:
                suspicious_links.append(link)
                info.append(f"Suspicious or unregistered link detected: {link}")
            else:
                info.append(f"Valid bank link detected: {link}")
        if suspicious_links:
            risk_score += 25

        # -----------------------------
        # 3. Amount detection
        # -----------------------------
        amounts = re.findall(r'₹\d+(?:,\d+)?', text)
        for amt in amounts:
            value = int(amt.replace("₹","").replace(",",""))
            if value > 10000:
                risk_score += 20
                info.append(f"Large transaction detected: {amt}")

        # -----------------------------
        # 4. Bank mention / invalid URL
        # -----------------------------
        for bank_name, bank_info in self.banks_db.items():
            if bank_name.lower() in text.lower():
                for link in links:
                    if bank_info['url'] not in link:
                        risk_score += 15
                        info.append(f"Bank mentioned: {bank_name}, but link does not match official URL.")

        # -----------------------------
        # Cap risk score
        # -----------------------------
        risk_score = min(risk_score, 100)

        # -----------------------------
        # Risk level assignment
        # -----------------------------
        if risk_score <= 30:
            level = "LOW → Safe enough"
            safe = "YES"
        elif risk_score <= 70:
            level = "MEDIUM → Be careful"
            safe = "NO"
        else:
            level = "HIGH → Very risky"
            safe = "NO"

        return {
            "risk_score": risk_score,
            "risk_level": level,
            "info": "\n".join(info) if info else "No issues detected",
            "safe_to_proceed": safe
        }
