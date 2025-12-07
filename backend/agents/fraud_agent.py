import os
import google.generativeai as genai
from backend.agents.base import BaseAgent
from backend.models import AgentResponse
import json

class FraudAgent(BaseAgent):
    def __init__(self):
        super().__init__(name="FraudAgent")
        # Ensure API key is set
        api_key = os.getenv("GOOGLE_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-pro')
        else:
            self.model = None
            print("Warning: GOOGLE_API_KEY not found.")

    async def analyze(self, query: str, context: dict = None) -> AgentResponse:
        if not self.model:
            return AgentResponse(
                agent_name=self.name,
                confidence=0.0,
                analysis="API Key missing",
                verdict="UNKNOWN"
            )

        prompt = f"""
        You are a financial fraud detection expert. Analyze the following transaction/query for potential fraud indicators.
        Query: {query}
        Context: {context}
        
        Provide a JSON response with the following keys:
        - "confidence": float (0.0 to 1.0)
        - "analysis": string (explanation)
        - "verdict": string ("SAFE", "SUSPICIOUS", "DANGER")
        """
        
        try:
            response = self.model.generate_content(prompt)
            # Basic parsing - in production, use structured output or more robust parsing
            text = response.text.strip()
            # Remove markdown code blocks if present
            if text.startswith("```json"):
                text = text[7:-3]
            elif text.startswith("```"):
                text = text[3:-3]
            
            data = json.loads(text)
            return AgentResponse(
                agent_name=self.name,
                confidence=data.get("confidence", 0.0),
                analysis=data.get("analysis", "No analysis provided"),
                verdict=data.get("verdict", "UNKNOWN")
            )
        except Exception as e:
            return AgentResponse(
                agent_name=self.name,
                confidence=0.0,
                analysis=f"Error analyzing: {str(e)}",
                verdict="UNKNOWN"
            )
