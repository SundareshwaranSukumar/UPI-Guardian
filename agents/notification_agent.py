from .base_agent import BaseAgent

class NotificationAgent(BaseAgent):
    """Handles sending alerts to user based on risk levels"""

    def __init__(self, name):
        super().__init__(name)

    def perform_task(self, analysis_result):
        """
        Input: dict from MessageRiskAgent or FraudDetectionAgent
        Output: formatted alert string
        """
        try:
            risk = analysis_result.get("risk_level") or analysis_result.get("fraud_level")
            safe = analysis_result.get("safe_to_proceed")
            alerts = analysis_result.get("info") or analysis_result.get("alerts")
            message_id = analysis_result.get("transaction_id", "N/A")

            alert_msg = f"""
[ALERT] {message_id}
Risk Level: {risk}
Safe to Proceed: {safe}
Details:
{alerts}
"""
            self.log(alert_msg.strip())
            return alert_msg.strip()
        except Exception as e:
            self.log(f"Notification error: {e}")
            return "Error generating notification"
