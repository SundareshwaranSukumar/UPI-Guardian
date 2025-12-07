from agents.message_risk_agent import MessageRiskAgent
from agents.fraud_detection_agent import FraudDetectionAgent
from agents.notification_agent import NotificationAgent

class UPIService:
    """
    Orchestrates the UPI Guardian agents:
    - FraudDetectionAgent for transaction analysis
    - MessageRiskAgent for message analysis
    - NotificationAgent for alerts
    """

    def __init__(self):
        self.fraud_agent = FraudDetectionAgent("FraudDetectionAgent")
        self.message_agent = MessageRiskAgent("MessageRiskAgent")
        self.notification_agent = NotificationAgent("NotificationAgent")

    def analyze_transaction(self, transaction):
        fraud_result = self.fraud_agent.perform_task(transaction)
        alert_msg = self.notification_agent.perform_task(fraud_result)
        return {"fraud_result": fraud_result, "alert": alert_msg}

    def analyze_message(self, message_text):
        risk_result = self.message_agent.perform_task(message_text)
        alert_msg = self.notification_agent.perform_task(risk_result)
        return {"risk_result": risk_result, "alert": alert_msg}

    def analyze_transactions_batch(self, transactions_list):
        return [self.analyze_transaction(txn) for txn in transactions_list]

    def analyze_messages_batch(self, messages_list):
        return [self.analyze_message(msg) for msg in messages_list]

    def analyze(self, transactions=None, messages=None):
        transactions = transactions or []
        messages = messages or []

        txn_results = self.analyze_transactions_batch(transactions)
        msg_results = self.analyze_messages_batch(messages)

        return {
            "transactions_analysis": txn_results,
            "messages_analysis": msg_results
        }
