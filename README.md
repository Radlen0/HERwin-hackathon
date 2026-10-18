# MIRA — AI Student Well-being Companion (HERwin Hackathon)

MIRA is an AI-powered emotional well-being companion for university students, built during the HERwin hackathon. It combines an empathetic chatbot, an expressive drawing canvas, and a daily inspiration feed in a calm, multilingual interface (English, French, and Tunisian Derja).

---

## The Problem

University students — especially young women in their first years of study and early careers (roughly 16–30) — carry a constant, heavy load:

- Exam pressure (partiels, PFE deadlines, soutenance), revision panic, and fear of failing.
- Comparison with peers, career uncertainty, and loneliness.
- The feeling that they must "hold everything at once", every day.

When stress peaks, most tools fail them:

- They are **clinical** (intake forms, therapy-speak) or **productivity-focused** (study planners and task lists when what's needed is to feel heard).
- They are **one-size-fits-all**: they do not adapt tone to how overwhelmed the person actually is, and many push toxic positivity ("you've got this!").
- They are **English-only**, which excludes students who think and feel in French or Derja.
- **Crisis resources are buried** and rarely localized to where the student actually is.

The result: students in distress have no place that feels like a close, emotionally intelligent friend.

## The Solution

MIRA is a quiet, always-available companion that adapts to the student's state instead of optimizing her life.

- **Welcome check-in**: the student picks a mood (Calm, Moderate, Frustrated), selects the struggles weighing on her (multi-select), and can add a custom note — in English, French, or Tunisian Derja.
- **MiraAI chat**: an empathetic companion that validates first and never rushes to solutions. A "Discuss today's struggles" shortcut lets her open the conversation from the struggles she already selected.
- **Expressive Paint canvas**: a cathartic drawing space with brushes, colors, stickers, undo/redo, and PNG export.
- **Home dashboard**: quick access to every space plus a 3D draggable carousel of daily inspirational messages generated for her current state.
- **Safety-first**: if the conversation suggests self-harm or danger, the AI sets everything else aside, responds warmly, and guides the student to Tunisian crisis resources.

---

## AI Integration

All AI features are served by the Python FastAPI backend (`backend/main.py`), which calls **OpenRouter chat completions** (DeepSeek model) using two carefully engineered system prompts (`backend/prompts.py`):

### 1. Chatbot — `POST /chat`

- The frontend sends the full conversation history, the current `mood`, the `selectedProblems`, and the `language`.
- The backend maps the app mood to a stress level (`calm`, `moderate`, `stressed`) and appends a derived context block (`stress_level`, `selected_struggles`, `respond_in`) as a second system message.
- `chatbot_prompt` governs the persona: support before solutions, tone calibrated silently by stress level (never named), validation before reframing, no toxic positivity or unsolicited advice, and a dedicated crisis protocol.
- The response is returned as `{ "response": "<reply>" }` and rendered in the chat UI.

### 2. Daily Inspirations — `GET /daily`

- `quotes_prompt` generates short, honest messages matched to the student's state — no clichés, no hustle culture, no guarantees.
- The model is instructed to return **strict JSON**, and the backend safely parses it into structured cards:

```json
{
  "speeches": [
    {
      "id": "daily-...",
      "title": "Room to Pause",
      "quote": "Nothing needs solving this minute.",
      "speech": "You don't have to solve anything right now. Let yourself pause.",
      "category": "Grounding",
      "authorOrTone": "MiraAI"
    }
  ]
}
```

- The 3D carousel on the Home screen renders these cards and can refresh them on demand.

### Resilience and safety

- If the backend is unreachable, the frontend keeps its local set of curated inspirational messages and shows an empathetic fallback message in chat instead of an error.
- Inspiration responses are generated per language and per mood (`stress_level`, `language`, `count` query params).

### Legacy AI endpoints (optional)

The Express hosting server (`frontend/HERwin/server.ts`) still contains Gemini-based endpoints (`/api/support-session`, `/api/roadmap-generate`, `/api/art-reflection`, and its own `/api/chat`) used by the older `demo/` screens. The final app does not depend on them; they only require `GEMINI_API_KEY` if you want to run the demo screens.

---

## How to Run the Project

### Prerequisites

- Python 3.10+
- Node.js 18+
- An [OpenRouter](https://openrouter.ai) API key

### 1. Start the AI backend (FastAPI)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Create the environment file `backend/local_env/.env` (or `backend/.env`):

```bash
OPENROUTER_API_KEY="your_openrouter_key"
```

Run the API on port 8000:

```bash
uvicorn main:app --reload --port 8000
```

Quick check: <http://localhost:8000/docs> (interactive API documentation).

### 2. Start the frontend

```bash
cd frontend/HERwin
npm install
npm run dev
```

Open <http://localhost:3000>. The React app is served by the Express + Vite server in `server.ts`.

Optional `frontend/HERwin/.env` (copy from `.env.example`):

```bash
VITE_API_BASE_URL="http://localhost:8000"   # defaults to this value if unset
GEMINI_API_KEY="..."                        # only needed for legacy demo endpoints
```

### 3. Try it

1. On the welcome screen, pick how you feel, select what is weighing on you, choose a language, and proceed.
2. Chat with MiraAI — try "Discuss today's struggles" to start from your selection.
3. Head Home and drag the carousel vertically; use the refresh button to pull new AI-generated reflections from `/daily`.

### API reference

| Method | Endpoint  | Purpose                                                        |
| ------ | --------- | -------------------------------------------------------------- |
| POST   | `/chat`   | Conversational reply from Mira (`messages`, `mood`, `selectedProblems`, `language`) |
| GET    | `/daily`  | Structured inspirational cards (`stress_level`, `language`, `count`) |

---

## Tech Stack

**Frontend**

- React 19 + TypeScript
- Vite (dev/build) with Tailwind CSS v4
- `motion/react` for the 3D draggable inspiration carousel
- `lucide-react` icons
- Express + `tsx` hosting server (`server.ts`) that mounts Vite middleware in development

**Backend**

- Python + FastAPI + Pydantic
- Uvicorn (ASGI server)
- `requests` + `python-dotenv`

**AI**

- OpenRouter chat completions (DeepSeek) with two engineered system prompts: a companion persona for chat and a structured-JSON generator for daily inspirations
- Optional Google Gemini endpoints on the Express server for the legacy demo screens

---

*"You don't have to solve everything today. Just take the next step."*
