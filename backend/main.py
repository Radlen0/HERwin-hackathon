from fastapi import FastAPI
from dotenv import load_dotenv
from prompts import chatbot_prompt, quotes_prompt
import requests
import json
import os

load_dotenv("local_env/.env")
api_openrouter = os.getenv("OPENROUTER_API_KEY")
app = FastAPI()

@app.get("/chat")
def chat(stress_level: str, user_messages: list[dict] | None = [], selected_struggles: list[str] | None = []):
    if (api_openrouter == None or stress_level not in ["calm", "moderate", "stressed"]):
        return { "ERROR": "Can't respond" }

    messages = [
        {
            "role": "system",
            "content": chatbot_prompt
        }
    ]
    if (user_messages == None): user_messages = []
    for mess in user_messages: messages.append(mess)

    response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": "Bearer " + api_openrouter,
                "Content-Type": "application/json",
            },
            data=json.dumps({
                "model": "~deepseek/deepseek-pro-latest",
                "messages": messages,
                "max_tokens": 19819
            })
        )
    response = response.json()
    response = response['choices'][0]['message']
    return response

@app.get("/daily")
def get_daily(stress_level: str, note: str | None = ""):
    if (api_openrouter == None or stress_level not in ["calm", "moderate", "stressed"]):
            return { "ERROR": "Can't respond" }
    
    messages = [
        {
            "role": "system",
            "content": chatbot_prompt
        },
        {
             "role": "user",
             "content": "stress level: " + stress_level + "\nnote: " + (note if note != None else "")
        }
    ]

    response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": "Bearer " + api_openrouter,
                "Content-Type": "application/json",
            },
            data=json.dumps({
                "model": "~deepseek/deepseek-pro-latest",
                "messages": messages,
                "max_tokens": 19819
            })
        )
    response = response.json()
    response = response['choices'][0]['message']
    return response