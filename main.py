from services.upi_service import UPIService
import datetime
import json

def main():
    upi_service = UPIService()

    # -------------------------------
    # Sample transaction
    # -------------------------------
    transaction = {
        "id": "TXN001",
        "amount": 45000,
        "timestamp": datetime.datetime.now().isoformat(),
        "location": "Mumbai",
        "merchant": "Unknown Merchant",
        "notes": "Please verify your account"
    }

    txn_result = upi_service.analyze_transaction(transaction)
    print("Transaction Analysis Result:")
    print(json.dumps(txn_result, indent=4))

    # -------------------------------
    # Sample message
    # -------------------------------
    message = "Your account XXXX1234 has been debited with ₹50,000. Click here: http://fakebank.link OTP:123456"
    msg_result = upi_service.analyze_message(message)
    print("\nMessage Analysis Result:")
    print(json.dumps(msg_result, indent=4))

if __name__ == "__main__":
    main()
