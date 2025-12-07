from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.models import GuardianRequest, GuardianResponse
from backend.agents.orchestrator import Orchestrator
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="UPI Guardian API")

# Allow CORS for frontend
origins_str = os.getenv("ALLOWED_ORIGINS", "*")
origins = [origin.strip() for origin in origins_str.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

orchestrator = Orchestrator()

@app.get("/")
def health_check():
    return {"status": "running", "service": "UPI Guardian Backend"}

@app.post("/analyze", response_model=GuardianResponse)
async def analyze_query(request: GuardianRequest):
    try:
        response = await orchestrator.process_request(request.query, request.context)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
