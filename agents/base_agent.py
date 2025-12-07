class BaseAgent:
    """Base class for all agents"""

    def __init__(self, name):
        self.name = name

    def log(self, message):
        print(f"[{self.name}] {message}")

    def perform_task(self, data):
        raise NotImplementedError("Must be implemented by subclass")
