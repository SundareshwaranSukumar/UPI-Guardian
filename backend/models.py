from pydantic import BaseModel
from typing import List, Optional, Any

class Message(BaseModel):
    role: str
    content: str

class GuardianRequest(BaseModel):
    query: str
    context: Optional[dict] = None

class AgentResponse(BaseModel):
    agent_name: str
    confidence: float
    analysis: str
    verdict: str  # "SAFE", "SUSPICIOUS", "DANGER"

class GuardianResponse(BaseModel):
    orchestrator_summary: str
    agent_details: List[AgentResponse]
