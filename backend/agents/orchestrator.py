import asyncio
from typing import List
from backend.agents.fraud_agent import FraudAgent
from backend.agents.scam_agent import ScamAgent
from backend.models import GuardianResponse, AgentResponse

class Orchestrator:
    def __init__(self):
        self.pdf_agent = None # Placeholder if we add PDF parsing later
        self.fraud_agent = FraudAgent()
        self.scam_agent = ScamAgent()
        self.agents = [self.fraud_agent, self.scam_agent]

    async def process_request(self, query: str, context: dict = None) -> GuardianResponse:
        # logic to determine which agents to use. For now, we use all relevant ones.
        # In a more advanced system, we'd use an LLM router here.
        
        tasks = [agent.analyze(query, context) for agent in self.agents]
        results: List[AgentResponse] = await asyncio.gather(*tasks)
        
        # Synthesize a summary
        # Simple logic: if any danger, overall danger.
        verdicts = [r.verdict for r in results]
        
        summary = "Analysis Complete. "
        if "DANGER" in verdicts:
            summary += "HIGH RISK DETECTED. Please proceed with extreme caution or abort."
        elif "SUSPICIOUS" in verdicts:
            summary += "Potential risks identified. Review details carefully."
        else:
            summary += "No immediate threats detected based on current analysis."

        return GuardianResponse(
            orchestrator_summary=summary,
            agent_details=results
        )
