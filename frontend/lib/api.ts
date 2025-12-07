import { toast } from "sonner";

export interface AgentResponse {
    agent_name: string;
    confidence: number;
    analysis: string;
    verdict: "SAFE" | "SUSPICIOUS" | "DANGER" | "UNKNOWN";
}

export interface GuardianResponse {
    orchestrator_summary: string;
    agent_details: AgentResponse[];
}

// Use environment variable for API URL or default to localhost for dev
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const analyzeQuery = async (query: string, context?: Record<string, any>): Promise<GuardianResponse | null> => {
    try {
        const response = await fetch(`${API_URL}/analyze`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ query, context }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data: GuardianResponse = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to analyze query:", error);
        toast.error("Failed to connect to Guardian backend. Is it running?");
        return null;
    }
};
