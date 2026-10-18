import json
import os
import time

import requests
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field

from prompts import chatbot_prompt, quotes_prompt

load_dotenv("local_env/.env")
load_dotenv()

api_openrouter = os.getenv("OPENROUTER_API_KEY")

MODEL = "~deepseek/deepseek-pro-latest"
MAX_TOKENS = 19819

app = FastAPI(title="Mira API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Frontend moods (MoodType) -> stress levels expected by the prompts
STRESS_BY_MOOD = {
    "calm": "calm",
    "focused": "calm",
    "moderate": "moderate",
    "anxious": "moderate",
    "sad": "moderate",
    "frustrated": "stressed",
    "overwhelmed": "stressed",
}

LANGUAGE_NAMES = {
    "en": "English",
    "fr": "French",
    "derja": "Tunisian Derja written in Arabizi (Latin script)",
}


def stress_level_for(mood: str | None) -> str:
    if mood is None:
        return "moderate"
    mood = mood.lower()
    if mood in ("calm", "moderate", "stressed"):
        return mood
    return STRESS_BY_MOOD.get(mood, "moderate")


def language_name(language: str | None) -> str:
    return LANGUAGE_NAMES.get(language or "en", "English")


def _require_api_key() -> None:
    if api_openrouter is None:
        raise HTTPException(status_code=503, detail="OPENROUTER_API_KEY is not configured")


def _call_openrouter(messages: list[dict]) -> str:
    response = requests.post(
        url="https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": "Bearer " + api_openrouter,
            "Content-Type": "application/json",
        },
        data=json.dumps({
            "model": MODEL,
            "messages": messages,
            "max_tokens": MAX_TOKENS,
        }),
        timeout=120,
    )
    response.raise_for_status()
    return response.json()["choices"][0]["message"]["content"].strip()


def _parse_speeches(raw: str, count: int) -> list[dict]:
    text = raw.strip()
    if text.startswith("```"):
        text = text.strip("`").strip()
        if text.lower().startswith("json"):
            text = text[4:].strip()

    start, end = text.find("["), text.rfind("]")
    if start == -1 or end < start:
        return []
    try:
        items = json.loads(text[start:end + 1])
    except json.JSONDecodeError:
        return []

    stamp = int(time.time())
    speeches = []
    for i, item in enumerate(items):
        if not isinstance(item, dict):
            continue
        message = str(item.get("message") or item.get("speech") or "").strip()
        if not message:
            continue
        speeches.append({
            "id": f"daily-{stamp}-{i}",
            "title": str(item.get("title") or "A quiet thought").strip(),
            "speech": message,
            "quote": str(item.get("quote") or "").strip(),
            "category": str(item.get("category") or "Inspiration").strip(),
            "authorOrTone": "MiraAI",
        })
        if len(speeches) >= count:
            break
    return speeches


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    messages: list[ChatMessage] = Field(default_factory=list)
    mood: str | None = None
    selected_problems: list[str] = Field(default_factory=list, alias="selectedProblems")
    language: str | None = None


@app.post("/chat")
def chat(payload: ChatRequest) -> dict:
    _require_api_key()

    context = [f"stress_level: {stress_level_for(payload.mood)}"]
    if payload.selected_problems:
        context.append("selected_struggles: " + ", ".join(payload.selected_problems))
    if payload.language:
        context.append("respond_in: " + language_name(payload.language))

    messages = [
        {"role": "system", "content": chatbot_prompt},
        {"role": "system", "content": "\n".join(context)},
    ]
    messages.extend(m.model_dump() for m in payload.messages)

    return {"response": _call_openrouter(messages)}


@app.get("/daily")
def get_daily(
    stress_level: str = "moderate",
    note: str = "",
    language: str = "en",
    count: int = 5,
) -> dict:
    _require_api_key()

    count = max(1, min(count, 10))
    prompt_lines = [
        f"stress level: {stress_level_for(stress_level)}",
        f"count: {count}",
        f"write in: {language_name(language)}",
    ]
    if note:
        prompt_lines.append(f"note: {note}")

    messages = [
        {"role": "system", "content": quotes_prompt},
        {"role": "user", "content": "\n".join(prompt_lines)},
    ]

    return {"speeches": _parse_speeches(_call_openrouter(messages), count)}
