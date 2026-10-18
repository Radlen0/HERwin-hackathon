# Nefes — Final Version

This directory (`/final`) contains the production-ready code migrated feature-by-feature from `/demo`.

## Migration Log

- [x] **Feature 1: Welcome Screen**
  - Floating panel design with embedded header controls (no top nav bar)
  - 3-Mood Selector: Calm, Moderate, Frustrated
  - Common struggles list identical across all moods with multi-select (select 1 or more challenges)
  - Custom note/course input
  - Directly proceeds to chosen screen (Home, Chatbot, Paint)
  - Full multilingual support (English, French, Tunisian Derja)

- [x] **Feature 2: Mascot Agent Chatbot Screen**
  - Full-screen responsive conversational interface
  - Animated MascotBrain agent representation with active online status
  - On the first request: **"Discuss today's problems"** quick-action button
    - *Only visible if the user selected a common problem on the welcome screen*
    - *Hidden if no common problems were selected*
  - Powered by `/api/chat` with Gemini 2.5 Flash and empathetic local fallback engine

- [x] **Feature 3: Paint Screen (Cathartic Creative Canvas)**
  - Full-screen responsive creative canvas for mobile and desktop
  - Color palette, brush sizes, eraser, undo, redo, clear, and PNG export
  - Clean drawing workspace with inspirational quotes removed

- [x] **Feature 4: Home Screen (Sanctuary Dashboard)**
  - Responsive layout for mobile and desktop with quick access to all features (Chatbot, Paint, Re-tune Check-in)
  - Interactive 3D vertical dragging **Inspirational Messages Carousel** powered by `motion/react` with depth blur and 3D tilt
  - Dedicated dataset (`inspirationalMessages.ts`) easily pluggable into future APIs
  - Strictly no secondary mood evaluation on this screen

## Upcoming Features (Moved on User Order)
- [ ] Feature 5: Bloom Garden Sanctuary & Diamond Economy
- [ ] Feature 6: Breathing & Sensory Exercises
