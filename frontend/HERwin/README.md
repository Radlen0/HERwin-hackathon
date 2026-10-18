# NEFES — AI-Powered Student Well-being Companion

**Nefes (نَفَس)** is an AI-powered emotional well-being companion crafted with care for university students in Tunisia dealing with exam pressure, project deadlines (PFE / soutenance / partiels), career uncertainty, and everyday academic stress.

> *"You don't have to solve everything today. Just take the next step."*

---

## 🌟 Key Features

1. **Screen A — Daily Mood Dashboard**:
   - Greeting & situation input supporting Tunisian Derja (Arabizi & Arabic script), French, and English.
   - 6 expressive mood characters: Calm (Sage Green), Anxious (Yellow), Sad (Lavender), Focused (Sky Blue), Frustrated (Coral), and Overwhelmed (Pink).
   - "A small insight" card with the signature meditating pink brain mascot and one-click session launcher.
   - "For you right now" interactive activity recommendations (Breathe & reset, Evening wind-down, Body reset, Let it out).
   - Floating rounded black navigation bar with active indicators.

2. **Screen B — Monthly Mood Journey Calendar**:
   - Full monthly calendar displaying recorded mood characters per date.
   - "This month's insight" card with frequency bar visualization (*Rarely* to *Often*).
   - Date inspector with personal note review and check-in editing.
   - Privacy controls: individual entry deletion and full history wipe with local-only storage.

3. **Screen C — Guided Breathing Player ("Deep Calm")**:
   - Meditating mascot seated on a lush botanical hill with foliage and sparkles.
   - Animated 4-4-4 breathing circle with gentle visual pulses.
   - Live countdown timer with pause, resume, restart, and 15s skip controls.
   - Organic ambient sound synthesizer (Web Audio API) supporting:
     - Forest sound (gentle foliage breeze + bird chimes)
     - Soft rain
     - Ocean tide
     - Zen singing bowl
     - Mute toggle & volume control.
   - Reassuring footer: *"You're safe. Just breathe."*

4. **Screen D — AI Adaptive Support Session (Core Innovation)**:
   - **Understand → Personalize → Act → Receive Feedback → Adapt** workflow.
   - Evaluates user stressor, energy level (Low, Medium, High), and available time (3, 5, 10 min).
   - Server-side Gemini API (`gemini-3.8-flash`) returning structured micro-actions and grounding steps.
   - Deterministic crisis triage pathway providing verified Tunisian emergency contacts:
     - Numéro Vert d'Assistance Psychologique: `80 10 50 50`
     - SAMU (Urgences Médicales): `190`
     - Protection Civile: `198`
     - Hôpital Razi La Manouba: `+216 71 600 700`
   - Active feedback loop (*"I feel a little better"*, *"I feel about the same"*, *"I feel worse"*):
     - Better: Celebrates progress and provides progressive closure.
     - Same: Reduces friction into an even smaller 2-minute step.
     - Worse: Halts productivity goals and pivots immediately to sensory rest and human support.
5. **Feature: Paint How You Feel**:
   - Interactive emotional-expression HTML5 canvas with touch and mouse support.
   - Accessible color palette (Sage, Forest, Sunlight, Coral, Lavender, Sky, Rose, Charcoal, White).
   - Brush-size controls (Fine, Medium, Bold, Wash), eraser, clear canvas, undo/redo history.
   - Expressive stickers (Heart, Star, Leaf, Sun, Cloud, Flower, Sparkle).
   - User-defined artwork description and emotion chips.
   - Server-side AI reflection (`/api/art-reflection`) that honors the user's subjective meaning without mental-health diagnosis.
   - Save artwork to device or local session. Awards **+5 diamonds** upon reflection.

6. **Feature: AI Task Roadmap ("My Roadmap")**:
   - Natural language and structured workload extraction (`/api/roadmap-generate`).
   - Identifies deadlines, dependencies, effort, uncertainty, and workload feasibility (*Manageable*, *Tight*, *Overloaded*).
   - Explains priority rationale and generates an editable schedule with 15-20 min restorative breaks.
   - One-click guilt-free rescheduling of unfinished tasks (`/api/roadmap-reschedule`).
   - Interactive task checklist with micro-substeps.
   - Rewards: **+10 diamonds** per completed task, **+5 diamonds** per restorative break, **+20 diamonds** per milestone.

7. **Feature: Nefes Bloom ("My Garden")**:
   - Dedicated virtual garden sanctuary where the meditating mascot rests.
   - Starts with a seed and blooms through progressive growth stages (*Seedling*, *Budding Sprout*, *Blooming Garden*, *Lush Haven*).
   - Diamond economy with duplicate-reward prevention.
   - Bloom Shop with cultural items:
     - Flowers: Jasmine de Tunisie (فل), Pastel Coral Rose, Lavender Blossom (10 💎)
     - Small Plants: Tunisian Mint (نعناع), Desert Succulent (20 💎)
     - Trees: Heritage Olive Tree (زيتونة), Orange Blossom (40 💎)
     - Decorations: Stone Reading Bench, Ceramic Fountain (50 💎)
     - Sanctuary House: Sidi Bou Said Cottage (150 💎)
   - Interactive grid placement and item inspection. Plants never die when inactive: *"Grow at your own pace."*

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Web Audio API
- **Backend**: Node.js, Express, tsx
- **AI**: `@google/genai` with `gemini-3.8-flash` structured JSON schema
- **Design Tokens**: Warm ivory `#FFF9E9`, Butter yellow `#F5F0D2`, Sage green `#A8BC78`, Primary olive `#6F8D45`, Soft coral `#F47C91`

---

## 🚀 Setup & Deployment

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `GEMINI_API_KEY` is provided.

### 3. Development Server
```bash
npm run dev
```
Starts Express + Vite server at `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
```

### 5. Start Production Server
```bash
npm run start
```
