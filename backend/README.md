# UPI Guardian Backend
This is the FastAPI backend for UPI Guardian, powered by Google's Generative AI (Gemini).

## Features
- **FastAPI**: High-performance async Python web framework.
- **Multi-Agent System**:
    - `FraudAgent`: Analyzes financial transactions for anomalies.
    - `ScamAgent`: Analyzes messages for social engineering attempts.
    - `Orchestrator`: Coordinates agents and synthesizes results.

## Setup

1.  **Install Dependencies**
    ```bash
    pip install -r requirements.txt
    ```

2.  **Environment Variables**
    Copy `.env.example` to `.env` and fill in your API key.
    ```bash
    cp .env.example .env
    ```
    - `GOOGLE_API_KEY`: Get this from [Google AI Studio](https://makersuite.google.com/).

3.  **Run the Server**
    ```bash
    python main.py
    ```
    The API will run at `http://localhost:8000`.
    A Swagger UI documentation is available at `http://localhost:8000/docs`.

## API Endpoints
- `POST /analyze`: Send a query text and context to get a safety analysis.
