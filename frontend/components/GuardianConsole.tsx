import React, { useState } from 'react';
import { Send, Shield, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { analyzeQuery, GuardianResponse } from '../lib/api';

const GuardianConsole = () => {
    const [input, setInput] = useState('');
    const [result, setResult] = useState<GuardianResponse | null>(null);
    const [loading, setLoading] = useState(false);

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        setLoading(true);
        setResult(null);
        try {
            const data = await analyzeQuery(input);
            setResult(data);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-4xl py-20">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 mb-4">
                    UPI Guardian AI
                </h1>
                <p className="text-muted-foreground text-lg">
                    Verify transactions and messages with our advanced multi-agent system.
                </p>
            </div>

            <div className="bg-card rounded-xl border shadow-sm p-6 mb-8">
                <form onSubmit={handleAnalyze} className="flex gap-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Paste suspicious text or transaction details here..."
                        className="flex-1 px-4 py-3 rounded-lg border bg-background focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Send className="w-5 h-5" />}
                        Analyze
                    </button>
                </form>
            </div>

            {result && (
                <div className="space-y-6">
                    <div className="bg-card rounded-xl border p-6 animate-in fade-in slide-in-from-bottom-4">
                        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                            <Shield className="w-6 h-6 text-blue-500" />
                            Guardian Assessment
                        </h2>
                        <p className="text-lg leading-relaxed">{result.orchestrator_summary}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {result.agent_details.map((agent, idx) => (
                            <div key={idx} className={`p-6 rounded-xl border ${agent.verdict === 'DANGER' ? 'bg-red-500/10 border-red-500/20' :
                                    agent.verdict === 'SUSPICIOUS' ? 'bg-yellow-500/10 border-yellow-500/20' :
                                        'bg-green-500/10 border-green-500/20'
                                }`}>
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-semibold text-lg">{agent.agent_name}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${agent.verdict === 'DANGER' ? 'bg-red-500 text-white' :
                                            agent.verdict === 'SUSPICIOUS' ? 'bg-yellow-500 text-yellow-900' :
                                                'bg-green-500 text-white'
                                        }`}>
                                        {agent.verdict}
                                    </span>
                                </div>
                                <p className="mb-4 text-sm opacity-90">{agent.analysis}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>Confidence:</span>
                                    <div className="h-2 flex-1 bg-black/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-current transition-all"
                                            style={{ width: `${agent.confidence * 100}%` }}
                                        />
                                    </div>
                                    <span>{(agent.confidence * 100).toFixed(0)}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GuardianConsole;
