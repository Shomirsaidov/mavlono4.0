# Cerebras AI Integration Guide

This document provides a comprehensive overview of how **Cerebras** and its high-speed inference models are integrated into the FAROVON platform. This can serve as a blueprint for future projects requiring ultra-fast, agentic AI capabilities.

## 1. Overview
We use Cerebras to power the platform's "AI Coach" and HR "Oracle". Cerebras was chosen for its **unmatched inference speed** (Llama-3.1-70B at 2000+ tokens/sec), enabling complex agentic loops with multiple tool calls that still feel instantaneous to the user.

- **Primary Model:** `llama-3.3-70b` (Configurable via `CEREBRAS_MODEL`)
- **Key Capability:** Function Calling (OpenAI-compatible)
- **SDK:** `openai` Python library (standard client)

---

## 2. Low-Level Integration (`cerebras.py`)

Cerebras provides an OpenAI-compatible API. We initialize the client as follows:

```python
from openai import OpenAI
from django.conf import settings

def _get_client() -> OpenAI:
    return OpenAI(
        base_url="https://api.cerebras.ai/v1",
        api_key=settings.CEREBRAS_API_KEY,
    )
```

### The Agentic Loop
Unlike simple chat completions, our integration implements a full **agentic loop** that handles multi-turn tool calling within a single streaming response.

1.  **Request:** Send message history + `tools` (JSON schemas) to Cerebras.
2.  **Streaming:** The engine streams text deltas to the frontend instantly.
3.  **Tool Detection:** If the model decides to call a tool (e.g., `get_my_courses`), the loop:
    -   Pauses the user stream.
    -   Executes the local Python function (`dispatch_tool`).
    -   Appends the result to the message history.
    -   Recalls Cerebras to continue the response based on tool output.
4.  **Finalization:** Once the model stops, we parse any specialized XML tags (like `<CARDS>`) and send a "done" event.

---

## 3. Tool Calling System (`tools.py`)

Tools allow the AI to interact with the platform's database.

### Example Tool Definition
```python
# tools.py
def get_my_stats(user):
    return {
        "xp": user.xp,
        "level": user.level,
        "coins": user.coins,
        "completed_courses": user.enrollments.filter(status='completed').count()
    }

# Mapping for the agent
TOOL_FUNCTIONS = {
    "get_my_stats": get_my_stats,
    # ... other tools
}
```

### Tool Schema (OpenAI Format)
The AI needs to know *how* to call these functions:
```python
TOOL_SCHEMAS = [
    {
        "type": "function",
        "function": {
            "name": "get_my_stats",
            "description": "Get current user's XP, level, coins, and statistics",
            "parameters": {"type": "object", "properties": {}}
        }
    }
]
```

---

## 4. UI/UX: The `<CARDS>` Protocol

To bridge the gap between text and rich UI, we implemented a custom protocol. The system prompt instructs the AI:
> "If providing lists of courses or badges, wrap the data in `<CARDS type="...">[...]</CARDS>` tags."

**How it works:**
1.  **LLM Output:** "Here are your courses: <CARDS type=\"courses\">[{\"id\": 1, \"title\": \"Intro to AI\"}]</CARDS>"
2.  **Backend Processing:** `cerebras.py` uses Regex to extract these blocks.
3.  **Frontend Render:** The `AIChatPage` receives a SSE event `type: "cards"` and renders a React component (`CourseCard`) instead of raw JSON.

---

## 5. Specialized Use Cases

### A. HR Oracle (Non-Streamed)
For complex analytical reports, we use a structured prompt that passes raw company data (anonymized) to Cerebras.
- **Input:** Aggregated stats (total completions, average XP per department).
- **Task:** Generate a monthly "Prosperity Oracle" report.
- **Model:** `llama-3.3-70b` with `temperature=0.5` for consistency.

### B. Course Creator Assist
Trainers provide a title and objectives; Cerebras generates a JSON object containing a course description, learning outcomes, and suggested tags.

---

## 6. Configuration & Setup

### Environment Variables
```bash
CEREBRAS_API_KEY=sk_...
CEREBRAS_MODEL=llama-3.3-70b
```

### Handling Fallbacks
If the API key is missing or the service is down, the code in `cerebras.py` includes a `_fallback_response` handler that returns a "Demo Mode" message with a list of available slash-commands, ensuring the app remains functional.

---

## 7. Performance Tips for Future Projects
1.  **Low Latency:** Always use `stream=True`. Users perceive the system as faster when the first character appears within 100ms.
2.  **Context Management:** We limit the history to the last 20-40 turns to keep the token count manageable and the "reasoning" focused.
3.  **JSON Mode:** For tools or structured output, use the `max_completion_tokens` parameter to prevent the model from rambling.

---
*Documented for Farovon Hackathon 2026.*
