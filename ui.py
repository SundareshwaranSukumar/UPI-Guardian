import gradio as gr
import plotly.graph_objects as go
from agents.message_risk_agent import MessageRiskAgent
import re

# Initialize the agent
agent = MessageRiskAgent("MessageRiskAgent")

# -----------------------------
# Helper: Plotly gauge
# -----------------------------
def plot_risk_gauge(score):
    fig = go.Figure(go.Indicator(
        mode="gauge+number",
        value=score,
        title={'text': "Risk Score (%)"},
        gauge={
            'axis': {'range': [0, 100]},
            'bar': {'color': "red" if score>70 else "orange" if score>30 else "green"},
            'steps': [
                {'range': [0, 30], 'color': "green"},
                {'range': [30, 70], 'color': "orange"},
                {'range': [70, 100], 'color': "red"}
            ]
        }
    ))
    fig.update_layout(margin=dict(t=0,b=0,l=0,r=0))
    return fig

# -----------------------------
# Main function
# -----------------------------
def analyze_message(message, file=None):
    # If file uploaded, read text
    if file is not None:
        message = file.read().decode("utf-8")
    
    # Perform agent analysis
    result = agent.perform_task(message)

    # -----------------------------
    # Gauge chart
    # -----------------------------
    gauge_fig = plot_risk_gauge(result["risk_score"])

    # -----------------------------
    # Prepare info sections
    # -----------------------------
    keywords = []
    links = re.findall(r'http[s]?://\S+', message)
    # Extract keywords from fallback info
    for line in result["info"].split("\n"):
        if "Keyword detected" in line:
            keywords.append(line.replace("Keyword detected: ",""))
    
    return gauge_fig, result["risk_level"], result["safe_to_proceed"], "\n".join(keywords), "\n".join(links), result["info"]

# -----------------------------
# Gradio UI
# -----------------------------
with gr.Blocks(title="UPI Guardian - Fraud Detector") as demo:
    gr.Markdown("## 🚨 UPI Guardian: Fraud & Phishing Detector")
    gr.Markdown("Paste the message or upload a text file to analyze the risk.")

    with gr.Row():
        message_input = gr.Textbox(label="Enter message here", lines=5, placeholder="Paste message text...")
        file_input = gr.File(label="Or upload a text file", file_types=[".txt"])

    analyze_btn = gr.Button("Analyze")

    with gr.Row():
        gauge_output = gr.Plot(label="Risk Score")
        with gr.Column():
            risk_level_output = gr.Textbox(label="Risk Level")
            safe_output = gr.Textbox(label="Safe to Proceed")
            keywords_output = gr.Textbox(label="Detected Keywords")
            links_output = gr.Textbox(label="Detected Links")
            details_output = gr.Textbox(label="Detailed Info / Advice")

    analyze_btn.click(
        analyze_message, 
        inputs=[message_input, file_input],
        outputs=[gauge_output, risk_level_output, safe_output, keywords_output, links_output, details_output]
    )

demo.launch(share=True)
