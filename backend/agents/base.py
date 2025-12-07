from abc import ABC, abstractmethod
from backend.models import AgentResponse

class BaseAgent(ABC):
    def __init__(self, name: str):
        self.name = name

    @abstractmethod
    async def analyze(self, query: str, context: dict = None) -> AgentResponse:
        pass
