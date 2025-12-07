# UPI Guardian - AI-Powered Financial Safety

UPI Guardian is a production-ready financial safety system designed to protect users from fraud and scams using Google's Generative AI. It consists of a React frontend and a FastAPI backend with specialized AI agents.

## 📁 Project Structure

```
UPI-Guardian/
├── backend/                # Python FastAPI Server
│   ├── agents/             # AI Agent Logic (Fraud, Scam, Orchestrator)
│   ├── main.py             # API Entry point
│   └── .env                # Backend Configuration (API Keys)
│
└── frontend/               # React + Vite Client
    ├── src/components/     # UI Components (GuardianConsole)
    └── .env                # Frontend Configuration (API URL)
```

## 🚀 Getting Started

Follow these steps to run the project.

### 1. Backend Setup (The Brain)
The backend runs the AI agents.

1.  Navigate to the backend folder:
    ```bash
    cd backend
    ```
2.  Install requirements:
    ```bash
    pip install -r requirements.txt
    ```
3.  **Configure Environment Variables**:
    *   We have created a `.env` file for you in `backend/.env`.
    *   Open it and paste your Google Genie API Key:
        ```env
        GOOGLE_API_KEY=your_actual_api_key
        ```
4.  Start the server:
    ```bash
    python main.py
    ```
    *Server will start at http://localhost:8000*

### 2. Frontend Setup (The Interface)
The frontend allows you to interact with the agents.

1.  Open a new terminal and navigate to frontend:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  **Configure Environment Variables**:
    *   We have created a `.env` file for you in `frontend/.env`.
    *   Ensure `VITE_API_URL` points to your backend:
        ```env
        VITE_API_URL=http://localhost:8000
        ```
4.  Start the app:
    ```bash
    npm run dev
    ```
    *App will run at http://localhost:8080*

## 🧠 How It Works

1.  **User Input**: You enter a transaction context or a suspicious message in the **Guardian Console** on the frontend.
2.  **API Call**: The frontend sends this data to the backend (`/analyze` endpoint).
3.  **Orchestrator**: The `Orchestrator` agent receives the request and dispatches it to:
    *   **FraudAgent**: Checks for financial anomalies using Gemini Pro.
    *   **ScamAgent**: Analyzes the text for social engineering patterns using Gemini Pro.
4.  **Synthesis**: The Orchestrator combines the verdicts from both agents into a final summary.
5.  **Response**: The result is sent back to the frontend and displayed with clear "Safe", "Suspicious", or "Danger" badges.

## ✅ Integration Verification
*   **Backend**: Exposes `POST /analyze` (Defined in `backend/main.py`).
*   **Frontend**: Consumes this endpoint using `fetch` in `frontend/lib/api.ts`.
*   **Security**: CORS is configured in `backend/main.py` to allow the frontend to communicate with the backend.

## 🔑 Key Files
*   **Backend Logic**: `backend/agents/orchestrator.py`
*   **Frontend UI**: `frontend/components/GuardianConsole.tsx`
