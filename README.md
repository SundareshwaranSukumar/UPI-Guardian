# UPI-Guardian
UPI Guardian is an AI-powered financial safety system designed to protect users from UPI fraud, suspicious transactions, social-engineering scams, and accidental money transfers.

## Architecture
The project follows a modern client-server architecture:
- **Frontend**: React + Vite + TailwindCSS (located in `/frontend`)
- **Backend**: FastAPI + Google Generative AI Agents (located in `/backend`)

## Getting Started

### Prerequisites
- Node.js & npm
- Python 3.9+
- Google Gemini API Key

### Installation

1.  **Backend Setup**
    Navigate to the backend directory and follow instructions in `backend/README.md`.
    ```bash
    cd backend
    pip install -r requirements.txt
    python main.py
    ```

2.  **Frontend Setup**
    Navigate to the frontend directory.
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

3.  **Usage**
    Open the frontend (default `http://localhost:8080`). Go to "Guardian AI" in the menu to interact with the multi-agent fraud detection system.

## Features
- **Multi-Agent Orchestration**: Specialized agents for different threat types.
- **Real-time Analysis**: Instant feedback on transaction queries.
- **Modern UI**: Smooth, responsive interface.
